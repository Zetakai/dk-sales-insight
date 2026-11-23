import { REQUIRED_COLUMNS, type ReadRow } from './csv';
import type { CleaningReport, RawRow, RowProblem, SaleLine } from './types';

/**
 * Raw rows -> cleaned invoice lines, plus a report of every change (docs/SPEC.md section 1). Nothing here throws
 * for a bad row: it is skipped and listed in `report.invalid` with its CSV line, so the UI can show it.
 */

export type CleanResult = { lines: SaleLine[]; report: CleaningReport };

/**
 * Short names sales teams write for a region, keyed by the lower-cased spelling. The value is the region's full
 * name, used as written only when the data never spells that region out in full (otherwise the data's own most
 * common spelling wins, so the alias can never introduce a second spelling of a region).
 */
const REGION_ALIASES: Record<string, string> = {
  jabar: 'Jawa Barat',
  jatim: 'Jawa Timur',
  jateng: 'Jawa Tengah',
  dki: 'Jabodetabek',
};

/**
 * Text a line cannot be counted without: it identifies the sale or is a dimension the dashboard groups by. A blank
 * here skips the row. `salesman` and `sku` are left out on purpose: no figure depends on them, and real exports carry
 * lines with a blank salesman whose sales are real and must be counted (they are reported in `blankSalesman`).
 */
const REQUIRED_TEXT = [
  'date',
  'invoice_no',
  'region',
  'branch',
  'outlet_id',
  'outlet_name',
  'outlet_type',
  'brand',
] as const;

/** Collapse runs of spaces and trim: "Grosir Sentosa Bintang " and "Grosir  Sentosa Bintang" are the same name. */
const tidy = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Real calendar date in YYYY-MM-DD (rejects 2026-02-30, 31/09/2026, 2026-9-1). */
function isIsoDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/**
 * Parse a whole number (rupiah, or cartons). A trailing ".0" or ".00" (a float export) is accepted, but "198.000" is
 * refused because in an Indonesian-locale export that is one hundred ninety-eight thousand, and reading it as 198
 * would silently cut the sale a thousandfold. Cartons are whole for the same reason: "1.050" is one thousand and
 * fifty, not 1.05. Accepts the Unicode minus sign.
 */
function parseWhole(raw: string): number | null {
  const s = raw.trim().replace(/^−/, '-');
  if (!/^[-+]?\d+(\.0{1,2})?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const NUMERIC: Array<keyof RawRow> = ['qty_carton', 'price_per_carton_idr', 'gross_sales_idr', 'discount_idr', 'net_sales_idr'];

/** A problem in English, for `reason` (the UI words the same problem in the page language). */
export function problemText(p: RowProblem): string {
  switch (p.code) {
    case 'empty':
      return `${p.column} is empty`;
    case 'badDate':
      return `date "${p.value}" is not a YYYY-MM-DD date`;
    case 'notWhole':
      return `${p.column} "${p.value}" is not ${p.column === 'qty_carton' ? 'a whole number of cartons' : 'a whole rupiah number'}`;
    case 'fieldCount':
      return `has ${p.got} fields, the header has ${p.want}${p.got > p.want ? ' (an unquoted comma?)' : ''}`;
  }
}

type Parsed = {
  raw: RawRow;
  regionRaw: string;
  nameRaw: string;
  line: Omit<SaleLine, 'region'>;
};

/** Check one row; returns the parsed line, or every problem found in it (a manager fixes a row once, not five times). */
function parseRow(raw: RawRow): Parsed | { problems: RowProblem[] } {
  const problems: RowProblem[] = [];
  for (const col of REQUIRED_TEXT) {
    if (tidy(raw[col]) === '') problems.push({ code: 'empty', column: col });
  }
  const date = raw.date.trim();
  if (date !== '' && !isIsoDate(date)) problems.push({ code: 'badDate', value: date });

  const nums: Partial<Record<keyof RawRow, number>> = {};
  for (const col of NUMERIC) {
    const v = raw[col].trim();
    if (v === '') {
      problems.push({ code: 'empty', column: col });
      continue;
    }
    const n = parseWhole(v);
    if (n === null) problems.push({ code: 'notWhole', column: col, value: v });
    else nums[col] = n;
  }
  if (problems.length > 0) return { problems };

  const invoiceNo = tidy(raw.invoice_no);
  let qtyCarton = nums.qty_carton!;
  let grossIdr = nums.gross_sales_idr!;
  let discountIdr = nums.discount_idr!;
  let netIdr = nums.net_sales_idr!;
  const isReturn = invoiceNo.toUpperCase().startsWith('RTR') || qtyCarton < 0;
  // A return must reduce sales. The sample writes it with negative figures; some systems write an RTR invoice with
  // positive ones, so those are flipped (all four together, keeping net = gross - discount true).
  if (isReturn && netIdr > 0) {
    qtyCarton = -Math.abs(qtyCarton);
    grossIdr = -grossIdr;
    discountIdr = -discountIdr;
    netIdr = -netIdr;
  }

  return {
    raw,
    regionRaw: raw.region,
    nameRaw: raw.outlet_name,
    line: {
      date,
      month: date.slice(0, 7),
      invoiceNo,
      isReturn,
      branch: tidy(raw.branch),
      outletId: tidy(raw.outlet_id),
      outletName: tidy(raw.outlet_name),
      outletType: tidy(raw.outlet_type),
      salesman: tidy(raw.salesman),
      brand: tidy(raw.brand),
      sku: tidy(raw.sku),
      qtyCarton,
      pricePerCartonIdr: nums.price_per_carton_idr!,
      grossIdr,
      discountIdr,
      netIdr,
    },
  };
}

/**
 * Title case for a region nobody spelled properly ("SULAWESI SELATAN" -> "Sulawesi Selatan"). Short all-caps words
 * stay as they are, since in region names they are acronyms (NTB, DIY).
 */
function titleCase(s: string): string {
  return s
    .split(' ')
    .map((w) => (w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ');
}

const hasMixedCase = (s: string) => s !== s.toUpperCase() && s !== s.toLowerCase();

/**
 * The canonical name for each region spelling. Spellings that match case-insensitively (or through an alias) are
 * one region, written the way the data writes it most often. On a tie the spelling seen first wins: the export's
 * own order is the only neutral tie-break, and it keeps the result the same every time the file is loaded.
 */
function canonicalRegions(spellings: string[]): Map<string, string> {
  type Group = { counts: Map<string, number>; aliasName?: string };
  const groups = new Map<string, Group>(); // lower-cased full name -> spellings seen
  const groupKey = (s: string) => {
    const lower = s.toLowerCase();
    const alias = REGION_ALIASES[lower];
    return alias ? { key: alias.toLowerCase(), alias } : { key: lower, alias: undefined };
  };

  for (const s of spellings) {
    const { key, alias } = groupKey(s);
    const g = groups.get(key) ?? { counts: new Map<string, number>() };
    groups.set(key, g);
    // An alias row ("Jabar") votes for nothing: it only says which group it belongs to.
    if (alias) g.aliasName = alias;
    else g.counts.set(s, (g.counts.get(s) ?? 0) + 1);
  }

  const nameOf = new Map<string, string>(); // group key -> canonical name
  for (const [key, g] of groups) {
    let best: string | undefined;
    let bestCount = 0;
    for (const [s, n] of g.counts) {
      if (n > bestCount) [best, bestCount] = [s, n]; // strict >: the first-seen spelling keeps a tie
    }
    // A region only ever written in one case is not a name we know; title-case it and keep it.
    if (best !== undefined && !hasMixedCase(best)) best = titleCase(best);
    nameOf.set(key, best ?? g.aliasName!);
  }

  const result = new Map<string, string>();
  for (const s of spellings) result.set(s, nameOf.get(groupKey(s).key)!);
  return result;
}

const byString = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export function cleanRows(rows: ReadRow[]): CleanResult {
  const invalid: CleaningReport['invalid'] = [];
  const duplicates: CleaningReport['duplicates'] = [];
  const blankSalesman: CleaningReport['blankSalesman'] = [];
  const kept: Parsed[] = [];
  const seen = new Set<string>();

  for (const r of rows) {
    if ('error' in r) {
      invalid.push({ line: r.line, reason: r.error, problems: [r.problem] });
      continue;
    }
    const parsed = parseRow(r.row);
    if ('problems' in parsed) {
      invalid.push({ line: r.line, reason: parsed.problems.map(problemText).join('; '), problems: parsed.problems });
      continue;
    }
    // Exact duplicate = all 15 columns identical as written (a double export of the same line). The first copy
    // is the sale; later copies are removed and listed one by one.
    const key = JSON.stringify(REQUIRED_COLUMNS.map((c) => r.row[c]));
    if (seen.has(key)) {
      duplicates.push({ invoiceNo: parsed.line.invoiceNo, sku: parsed.line.sku });
      continue;
    }
    seen.add(key);
    // Counted, but reported: a line nobody owns is a gap in the route data a manager will want to close.
    if (!parsed.line.salesman) blankSalesman.push({ line: r.line, invoiceNo: parsed.line.invoiceNo, outletId: parsed.line.outletId });
    kept.push(parsed);
  }

  // Regions are unified over the kept lines only, so a removed duplicate cannot tip the vote.
  const regionOf = canonicalRegions(kept.map((p) => tidy(p.regionRaw)));
  const lines: SaleLine[] = kept.map((p) => ({ ...p.line, region: regionOf.get(tidy(p.regionRaw))! }));

  // Fixes are reported per spelling as written in the file.
  const regionCounts = new Map<string, { to: string; rows: number }>();
  kept.forEach((p, i) => {
    const to = lines[i].region;
    if (p.regionRaw === to) return;
    const e = regionCounts.get(p.regionRaw) ?? { to, rows: 0 };
    e.rows++;
    regionCounts.set(p.regionRaw, e);
  });
  const regionFixes = [...regionCounts]
    .map(([from, e]) => ({ from, to: e.to, rows: e.rows }))
    .sort((a, b) => byString(a.from, b.from));

  const nameCounts = new Map<string, { outletId: string; from: string; to: string; rows: number }>();
  kept.forEach((p, i) => {
    const { outletId, outletName } = lines[i];
    if (p.nameRaw === outletName) return;
    const k = JSON.stringify([outletId, p.nameRaw]);
    const e = nameCounts.get(k) ?? { outletId, from: p.nameRaw, to: outletName, rows: 0 };
    e.rows++;
    nameCounts.set(k, e);
  });
  const nameFixes = [...nameCounts.values()].sort(
    (a, b) => byString(a.outletId, b.outletId) || byString(a.from, b.from),
  );

  const returns = lines
    .filter((l) => l.isReturn)
    .map((l) => ({ invoiceNo: l.invoiceNo, outletId: l.outletId, outletName: l.outletName, date: l.date, netIdr: l.netIdr }));

  // One name on several outlet ids: two real shops, both called "Toko Makmur". They stay separate outlets
  // (grouped by id); the list tells the UI and the summary to show a branch or id beside such a name.
  const idsByName = new Map<string, Set<string>>();
  for (const l of lines) {
    const ids = idsByName.get(l.outletName) ?? new Set<string>();
    ids.add(l.outletId);
    idsByName.set(l.outletName, ids);
  }
  const sharedNames = [...idsByName]
    .filter(([, ids]) => ids.size > 1)
    .map(([name, ids]) => ({ name, outletIds: [...ids].sort(byString) }))
    .sort((a, b) => byString(a.name, b.name));

  return {
    lines,
    report: {
      rowsRead: rows.length,
      rowsKept: lines.length,
      duplicates,
      regionFixes,
      nameFixes,
      returns,
      sharedNames,
      invalid,
      blankSalesman,
    },
  };
}
