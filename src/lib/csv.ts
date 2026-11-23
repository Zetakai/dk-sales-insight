import type { RawRow, RowProblem } from './types';

/**
 * CSV reading for sales exports. The sample is plain, but a manager may upload a file saved from Excel, so this
 * handles what Excel and Google Sheets produce: RFC 4180 quoting (commas, doubled quotes and line breaks inside a
 * quoted field), CRLF or CR line ends, a UTF-8 byte-order mark, a trailing newline and blank lines. The separator
 * is read from the header line: Excel in an Indonesian locale saves "CSV" with semicolons, some tools use tabs.
 */

/** The whole file cannot be used. `code` lets the UI explain it in the page language; `message` is English. */
export class CsvFileError extends Error {
  readonly code: 'empty' | 'missingColumns';
  readonly missing: string[];
  constructor(code: 'empty' | 'missingColumns', message: string, missing: string[] = []) {
    super(message);
    this.name = 'CsvFileError';
    this.code = code;
    this.missing = missing;
  }
}

/** The separator the header line uses most, outside quotes: comma, semicolon or tab (comma when none). */
export function detectSeparator(text: string): string {
  const counts = new Map<string, number>([[',', 0], [';', 0], ['\t', 0]]);
  let inQuotes = false;
  for (const c of text) {
    if (c === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (c === '\n' || c === '\r')) break;
    else if (!inQuotes && counts.has(c)) counts.set(c, counts.get(c)! + 1);
  }
  let best = ',';
  for (const [sep, n] of counts) if (n > counts.get(best)!) best = sep;
  return best;
}

/** The 15 columns every export must carry, by exact header name. Extra columns are ignored; order is free. */
export const REQUIRED_COLUMNS = [
  'date',
  'invoice_no',
  'region',
  'branch',
  'outlet_id',
  'outlet_name',
  'outlet_type',
  'salesman',
  'brand',
  'sku',
  'qty_carton',
  'price_per_carton_idr',
  'gross_sales_idr',
  'discount_idr',
  'net_sales_idr',
] as const satisfies readonly (keyof RawRow)[];

/** One parsed record and the 1-based file line it starts on, so a bad row can be pointed at in the file. */
export type CsvRecord = { line: number; fields: string[] };

/**
 * Split CSV text into records. Never throws: an unclosed quote simply runs to the end of the file, which the
 * row check later reports as a wrong field count.
 *
 * Line numbers count physical lines (a line break inside a quoted field moves the count on), so the number matches
 * what a text editor shows. Blank lines are dropped but still counted.
 */
export function parseCsv(text: string, separator?: string): CsvRecord[] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text; // UTF-8 BOM from Excel's "CSV UTF-8"
  const sep = separator ?? detectSeparator(src);
  const records: CsvRecord[] = [];
  let fields: string[] = [];
  let field = '';
  let inQuotes = false;
  let line = 1; // the physical line the cursor is on
  let recordLine = 1; // the line the current record started on
  // A record that is one empty unquoted field is a blank line, not data. `quoted` tells `""` apart from nothing.
  let quoted = false;

  const endRecord = () => {
    fields.push(field);
    const blank = fields.length === 1 && fields[0] === '' && !quoted;
    if (!blank) records.push({ line: recordLine, fields });
    fields = [];
    field = '';
    quoted = false;
  };

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"'; // a doubled quote is one literal quote
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (c === '\n' || (c === '\r' && src[i + 1] !== '\n')) line++;
        field += c;
      }
      continue;
    }
    if (c === '"' && field === '') {
      // A quote opens a quoted field only at the start of the field; a stray quote mid-field is kept as text.
      inQuotes = true;
      quoted = true;
    } else if (c === sep) {
      fields.push(field);
      field = '';
    } else if (c === '\r' || c === '\n') {
      if (c === '\r' && src[i + 1] === '\n') i++; // CRLF is one line end
      endRecord();
      line++;
      recordLine = line;
    } else {
      field += c;
    }
  }
  // The last record has no line end when the file has no trailing newline.
  if (field !== '' || fields.length > 0 || quoted) endRecord();
  return records;
}

/** Rows as objects keyed by column name, each with the line it starts on, or an error for that row. */
export type ReadRow = { line: number; row: RawRow } | { line: number; error: string; problem: RowProblem };

/**
 * Parse an export into rows. Throws (with a message the UI shows as is) only when the file as a whole cannot be
 * used: empty, or missing a required column. A single bad row never throws; it comes back with `error`.
 */
export function readRows(text: string): ReadRow[] {
  const records = parseCsv(text);
  if (records.length === 0) throw new CsvFileError('empty', 'The file is empty: no header row and no data.');

  // Header names match ignoring case and surrounding spaces ("Net_Sales_IDR " is net_sales_idr).
  const header = records[0].fields.map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    throw new CsvFileError(
      'missingColumns',
      `Missing column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
        `The file needs these columns in its first row: ${REQUIRED_COLUMNS.join(', ')}.`,
      missing,
    );
  }
  // If a name appears twice, the first one is the column used.
  const index = new Map<string, number>();
  header.forEach((h, i) => {
    if (!index.has(h)) index.set(h, i);
  });

  return records.slice(1).map(({ line, fields }) => {
    if (fields.length < header.length) {
      return {
        line,
        error: `has ${fields.length} fields, the header has ${header.length}`,
        problem: { code: 'fieldCount', got: fields.length, want: header.length },
      };
    }
    // Excel sometimes pads rows with empty trailing cells; anything else extra is usually an unquoted comma
    // inside a name, which would shift every later column, so the row is refused rather than misread.
    if (fields.slice(header.length).some((f) => f.trim() !== '')) {
      return {
        line,
        error: `has ${fields.length} fields, the header has ${header.length} (an unquoted comma?)`,
        problem: { code: 'fieldCount', got: fields.length, want: header.length },
      };
    }
    const row = {} as RawRow;
    for (const col of REQUIRED_COLUMNS) row[col] = fields[index.get(col)!];
    return { line, row };
  });
}
