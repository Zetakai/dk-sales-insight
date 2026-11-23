import { describe, expect, it } from 'vitest';
import { REQUIRED_COLUMNS } from './csv';
import { analyze } from './metrics';
import type { RawRow } from './types';

const HEADER = REQUIRED_COLUMNS.join(',');

/** One CSV line; any column can be overridden. Defaults are a plain 2-carton sale of Rp200.000. */
function row(over: Partial<RawRow> = {}): string {
  const base: RawRow = {
    date: '2026-09-01',
    invoice_no: 'INV1',
    region: 'Jabodetabek',
    branch: 'Jakarta Barat',
    outlet_id: 'OUT1',
    outlet_name: 'Toko A',
    outlet_type: 'Warung',
    salesman: 'Andi',
    brand: 'Sukro',
    sku: 'Sukro 100g',
    qty_carton: '2',
    price_per_carton_idr: '100000',
    gross_sales_idr: '200000',
    discount_idr: '0',
    net_sales_idr: '200000',
  };
  const r = { ...base, ...over };
  return REQUIRED_COLUMNS.map((c) => r[c]).join(',');
}

const csv = (...rows: string[]) => `${HEADER}\n${rows.join('\n')}\n`;

describe('bad rows', () => {
  it('skips a non-numeric amount and reports it with its CSV line, without throwing', () => {
    const i = analyze(csv(row(), row({ invoice_no: 'INV2', net_sales_idr: 'abc' }), row({ invoice_no: 'INV3' })));
    expect(i.cleaning.invalid).toEqual([
      {
        line: 3,
        reason: 'net_sales_idr "abc" is not a whole rupiah number',
        problems: [{ code: 'notWhole', column: 'net_sales_idr', value: 'abc' }],
      },
    ]);
    expect(i.cleaning.rowsRead).toBe(3);
    expect(i.cleaning.rowsKept).toBe(2);
    expect(i.totals.netIdr).toBe(400000);
  });

  it('lists every problem of a row at once: missing field, bad date, Indonesian thousands', () => {
    const i = analyze(csv(row({ outlet_id: ' ', date: '31/09/2026', price_per_carton_idr: '100.000' })));
    expect(i.cleaning.invalid).toMatchObject([
      {
        line: 2,
        reason:
          'outlet_id is empty; date "31/09/2026" is not a YYYY-MM-DD date; price_per_carton_idr "100.000" is not a whole rupiah number',
      },
    ]);
  });

  it('refuses part cartons: "1.050" in an Indonesian export is one thousand and fifty', () => {
    expect(analyze(csv(row({ qty_carton: '1.050' }))).cleaning.invalid[0].reason).toBe(
      'qty_carton "1.050" is not a whole number of cartons',
    );
  });

  it('refuses an impossible calendar date', () => {
    expect(analyze(csv(row({ date: '2026-02-30' }))).cleaning.invalid[0].reason).toMatch(/not a YYYY-MM-DD date/);
  });

  it('keeps a line with a blank salesman (no figure depends on it; the sample has 5)', () => {
    const i = analyze(csv(row({ salesman: '' }), row({ invoice_no: 'INV2', salesman: 'Budi' })));
    expect(i.cleaning.invalid).toEqual([]);
    expect(i.totals.netIdr).toBe(400000);
    expect(i.outlets[0].salesman).toBe('Budi'); // a blank never wins the most-lines vote
  });

  it('a file of only bad rows gives an empty result with the rows listed, never a throw', () => {
    const i = analyze(csv(row({ qty_carton: 'x' }), row({ date: '' })));
    expect(i.cleaning.invalid.map((x) => x.line)).toEqual([2, 3]);
    expect(i.period).toEqual({ from: '', to: '', months: [] });
    expect(i.totals.netIdr).toBe(0);
    expect(i.totals.changePct).toBeNull();
    expect(i.outlets).toEqual([]);
  });
});

describe('duplicates', () => {
  it('drops exact duplicates, keeps the first, reports each removed line', () => {
    const a = row({ invoice_no: 'INV7', sku: 'Sukro 100g' });
    const i = analyze(csv(a, row({ invoice_no: 'INV8' }), a, a));
    expect(i.cleaning.duplicates).toEqual([
      { invoiceNo: 'INV7', sku: 'Sukro 100g' },
      { invoiceNo: 'INV7', sku: 'Sukro 100g' },
    ]);
    expect(i.cleaning.rowsKept).toBe(2);
    expect(i.totals.netIdr).toBe(400000);
  });

  it('a line that differs in any column is not a duplicate', () => {
    const i = analyze(csv(row(), row({ discount_idr: '1000', net_sales_idr: '199000' })));
    expect(i.cleaning.duplicates).toEqual([]);
    expect(i.cleaning.rowsKept).toBe(2);
  });
});

describe('regions', () => {
  it('unifies case variants to the most common spelling and maps the aliases', () => {
    const i = analyze(
      csv(
        row({ region: 'Jawa Timur' }),
        row({ invoice_no: 'INV2', region: 'Jawa Timur' }),
        row({ invoice_no: 'INV3', region: 'JAWA TIMUR' }),
        row({ invoice_no: 'INV4', region: 'jatim' }),
        row({ invoice_no: 'INV5', region: 'Jabar' }),
        row({ invoice_no: 'INV6', region: 'DKI' }),
        row({ invoice_no: 'INV7', region: 'jateng' }),
      ),
    );
    expect(i.byRegion.map((r) => r.key).sort()).toEqual(['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur']);
    expect(i.byRegion.find((r) => r.key === 'Jawa Timur')!.netIdr).toBe(800000);
    expect(i.cleaning.regionFixes).toEqual([
      { from: 'DKI', to: 'Jabodetabek', rows: 1 },
      { from: 'JAWA TIMUR', to: 'Jawa Timur', rows: 1 },
      { from: 'Jabar', to: 'Jawa Barat', rows: 1 },
      { from: 'jateng', to: 'Jawa Tengah', rows: 1 },
      { from: 'jatim', to: 'Jawa Timur', rows: 1 },
    ]);
  });

  it('an alias joins the spelling the data already uses, even an odd one', () => {
    // The data writes "Jawa barat" most often; the alias must not add a second spelling "Jawa Barat".
    const i = analyze(csv(row({ region: 'Jawa barat' }), row({ invoice_no: 'INV2', region: 'jabar' })));
    expect(i.byRegion.map((r) => r.key)).toEqual(['Jawa barat']);
  });

  it('on a tie the spelling seen first wins', () => {
    const i = analyze(csv(row({ region: 'Sumatera' }), row({ invoice_no: 'INV2', region: 'SUMATERA' })));
    expect(i.byRegion.map((r) => r.key)).toEqual(['Sumatera']);
  });

  it('title-cases and keeps an unknown region written in one case only', () => {
    const i = analyze(csv(row({ region: 'SULAWESI SELATAN' }), row({ invoice_no: 'INV2', region: 'NTB' })));
    expect(i.byRegion.map((r) => r.key).sort()).toEqual(['NTB', 'Sulawesi Selatan']);
  });
});

describe('outlets', () => {
  it('trims outlet names and reports the fix per outlet', () => {
    const i = analyze(csv(row({ outlet_name: 'Toko A ' }), row({ invoice_no: 'INV2', outlet_name: 'Toko A ' })));
    expect(i.outlets[0].outletName).toBe('Toko A');
    expect(i.cleaning.nameFixes).toEqual([{ outletId: 'OUT1', from: 'Toko A ', to: 'Toko A', rows: 2 }]);
  });

  it('keeps outlets with one name apart by id and reports the shared name', () => {
    const i = analyze(csv(row(), row({ invoice_no: 'INV2', outlet_id: 'OUT2', branch: 'Bogor' })));
    expect(i.totals.outlets).toBe(2);
    expect(i.cleaning.sharedNames).toEqual([{ name: 'Toko A', outletIds: ['OUT1', 'OUT2'] }]);
  });
});

describe('returns', () => {
  it('keeps a return as a negative sale that reduces net, cartons and not the invoice count', () => {
    const i = analyze(
      csv(
        row({ qty_carton: '5', gross_sales_idr: '500000', net_sales_idr: '500000' }),
        row({ invoice_no: 'RTR1', date: '2026-09-05', qty_carton: '-2', gross_sales_idr: '-200000', net_sales_idr: '-200000' }),
      ),
    );
    expect(i.totals.netIdr).toBe(300000);
    expect(i.totals.returnsIdr).toBe(-200000);
    expect(i.totals.cartons).toBe(3);
    expect(i.totals.invoices).toBe(1);
    expect(i.cleaning.returns).toEqual([
      { invoiceNo: 'RTR1', outletId: 'OUT1', outletName: 'Toko A', date: '2026-09-05', netIdr: -200000 },
    ]);
  });

  it('a negative quantity marks a return even without the RTR prefix', () => {
    const i = analyze(csv(row(), row({ invoice_no: 'INV9', qty_carton: '-1', gross_sales_idr: '-100000', net_sales_idr: '-100000' })));
    expect(i.cleaning.returns.map((r) => r.invoiceNo)).toEqual(['INV9']);
    expect(i.totals.invoices).toBe(1);
    expect(i.totals.netIdr).toBe(100000);
  });

  it('an RTR invoice written with positive figures still reduces sales', () => {
    const i = analyze(csv(row(), row({ invoice_no: 'RTR2', qty_carton: '1', gross_sales_idr: '100000', net_sales_idr: '100000' })));
    expect(i.totals.netIdr).toBe(100000);
    expect(i.totals.cartons).toBe(1);
    expect(i.cleaning.returns[0].netIdr).toBe(-100000);
  });
});
