import { describe, expect, it } from 'vitest';
import { CsvFileError, detectSeparator, parseCsv, readRows, REQUIRED_COLUMNS } from './csv';
import { analyze } from './metrics';

const HEADER = REQUIRED_COLUMNS.join(',');
const ROW = '2026-09-01,INV1,Jabodetabek,Jakarta Barat,OUT1,Toko A,Warung,Andi,Sukro,Sukro 100g,2,100000,200000,0,200000';

describe('parseCsv', () => {
  it('reads quoted fields with commas, doubled quotes and line breaks inside', () => {
    const recs = parseCsv('a,b,c\n"x, y","say ""hi""","line1\nline2"\n');
    expect(recs).toEqual([
      { line: 1, fields: ['a', 'b', 'c'] },
      { line: 2, fields: ['x, y', 'say "hi"', 'line1\nline2'] },
    ]);
  });

  it('handles CRLF, a BOM, blank lines and a trailing newline', () => {
    const recs = parseCsv('﻿a,b\r\n1,2\r\n\r\n\r\n3,4\r\n');
    expect(recs).toEqual([
      { line: 1, fields: ['a', 'b'] },
      { line: 2, fields: ['1', '2'] },
      { line: 5, fields: ['3', '4'] },
    ]);
  });

  it('reads the last record when there is no trailing newline', () => {
    expect(parseCsv('a,b\n1,2').map((r) => r.fields)).toEqual([['a', 'b'], ['1', '2']]);
  });

  it('counts a line break inside quotes, so later rows keep their real line number', () => {
    const recs = parseCsv('a,b\n"multi\r\nline",1\n2,3\n');
    expect(recs.map((r) => r.line)).toEqual([1, 2, 4]);
  });

  it('keeps empty fields, including a quoted empty one', () => {
    expect(parseCsv('a,,""\n').map((r) => r.fields)).toEqual([['a', '', '']]);
  });

  it('returns nothing for an empty or whitespace-only file', () => {
    expect(parseCsv('')).toEqual([]);
    expect(parseCsv('\n\r\n\n')).toEqual([]);
  });
});

describe('readRows', () => {
  it('maps columns by header name, in any order, ignoring extra columns', () => {
    const header = ['note', ...[...REQUIRED_COLUMNS].reverse()].join(',');
    const row = ['hello', ...ROW.split(',').reverse()].join(',');
    const [r] = readRows(`${header}\n${row}\n`);
    expect(r).toMatchObject({ line: 2, row: { invoice_no: 'INV1', outlet_name: 'Toko A', net_sales_idr: '200000' } });
  });

  it('throws a clear error naming every missing column', () => {
    const header = REQUIRED_COLUMNS.filter((c) => c !== 'net_sales_idr' && c !== 'brand').join(',');
    expect(() => readRows(`${header}\n`)).toThrow(/Missing columns: brand, net_sales_idr/);
  });

  it('reads semicolon- and tab-separated exports (Excel in an Indonesian locale) and any header case', () => {
    for (const sep of [';', '\t']) {
      const header = REQUIRED_COLUMNS.map((c) => c.toUpperCase()).join(sep);
      const [r] = readRows(`${header}\n${ROW.split(',').join(sep)}\n`);
      expect(r).toMatchObject({ line: 2, row: { invoice_no: 'INV1', net_sales_idr: '200000' } });
    }
  });

  it('a comma inside a quoted field does not decide the separator', () => {
    expect(detectSeparator('"a,b,c";x;y\n1;2;3')).toBe(';');
    expect(detectSeparator('a,b\n1;2;3;4')).toBe(',');
  });

  it('throws a typed error the UI can translate', () => {
    const header = REQUIRED_COLUMNS.filter((c) => c !== 'brand').join(',');
    expect(() => readRows(`${header}\n`)).toThrow(CsvFileError);
    try {
      readRows(`${header}\n`);
    } catch (e) {
      expect((e as CsvFileError).code).toBe('missingColumns');
      expect((e as CsvFileError).missing).toEqual(['brand']);
    }
  });

  it('throws for an empty file', () => {
    expect(() => analyze('')).toThrow(/empty/);
  });

  it('reports a row with too few or too many fields instead of throwing', () => {
    const rows = readRows(`${HEADER}\n${ROW}\n2026-09-01,INV2,Jabodetabek\n${ROW},extra\n${ROW},,\n`);
    expect(rows[0]).toHaveProperty('row');
    expect(rows[1]).toEqual({
      line: 3,
      error: 'has 3 fields, the header has 15',
      problem: { code: 'fieldCount', got: 3, want: 15 },
    });
    expect(rows[2]).toMatchObject({ line: 4, error: expect.stringMatching(/unquoted comma/) });
    // Empty trailing cells (Excel padding) are fine.
    expect(rows[3]).toHaveProperty('row');
  });

  it('reads an Excel-style export end to end: BOM, CRLF, quoted name with a comma', () => {
    const text = `﻿${HEADER}\r\n${ROW.replace('Toko A', '"Toko A, Cabang 2"')}\r\n\r\n`;
    const i = analyze(text);
    expect(i.outlets[0].outletName).toBe('Toko A, Cabang 2');
    expect(i.totals.netIdr).toBe(200000);
    expect(i.cleaning.invalid).toEqual([]);
  });
});
