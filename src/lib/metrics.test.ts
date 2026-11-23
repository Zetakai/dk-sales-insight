import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { REQUIRED_COLUMNS } from './csv';
import { FIXTURE } from './fixture';
import { FIXTURE as REGION_FIXTURE } from './fixture-region';
import { FIXTURE as SALES_FIXTURE } from './fixture-sales';
import { analyze, round } from './metrics';
import type { RawRow } from './types';

const sample = readFileSync(new URL('../../data/demo.csv', import.meta.url), 'utf8');

/** One sale line: outlet, type, date and net; amounts kept consistent (qty 1, no discount). */
function sale(outlet: string, type: string, date: string, net: number, over: Partial<RawRow> = {}): string {
  const r: RawRow = {
    date,
    invoice_no: `INV-${outlet}-${date}`,
    region: 'Jawa Timur',
    branch: 'Malang',
    outlet_id: outlet,
    outlet_name: `Toko ${outlet}`,
    outlet_type: type,
    salesman: 'Sari',
    brand: 'Sukro',
    sku: 'Sukro 100g',
    qty_carton: '1',
    price_per_carton_idr: String(net),
    gross_sales_idr: String(net),
    discount_idr: '0',
    net_sales_idr: String(net),
    ...over,
  };
  return REQUIRED_COLUMNS.map((c) => r[c]).join(',');
}
const csv = (...rows: string[]) => `${REQUIRED_COLUMNS.join(',')}\n${rows.join('\n')}\n`;

describe('analyze(sample)', () => {
  it('deep-equals FIXTURE', () => {
    expect(analyze(sample)).toEqual(FIXTURE);
  });

  it('is the same on a second run (no hidden state)', () => {
    expect(analyze(sample)).toEqual(analyze(sample));
  });
});

// data/sales.csv is the sample export from the brief. It must match the Python reference exactly; and the invariants
// below also hold for any other export dropped in its place, without anyone writing a fixture for it.
const real = new URL('../../data/sales.csv', import.meta.url);
describe.skipIf(!existsSync(real))('analyze(data/sales.csv)', () => {
  it('deep-equals the Python reference (fixture-sales.ts) while it is the sample from the brief', () => {
    const i = analyze(readFileSync(real, 'utf8'));
    if (i.cleaning.rowsRead !== SALES_FIXTURE.cleaning.rowsRead) return; // someone replaced the file: invariants only
    expect(i).toEqual(SALES_FIXTURE);
  });

  it('adds up: regions, brands and outlets each sum to the total; 5 weakest', () => {
    const i = analyze(readFileSync(real, 'utf8'));
    const sum = (xs: { netIdr: number }[]) => xs.reduce((s, x) => s + x.netIdr, 0);
    expect(i.totals.netIdr).toBeGreaterThan(0);
    expect(sum(i.byRegion)).toBe(i.totals.netIdr);
    expect(sum(i.byBrand)).toBe(i.totals.netIdr);
    expect(sum(i.outlets)).toBe(i.totals.netIdr);
    expect(i.weakest).toHaveLength(Math.min(5, i.outlets.length));
    // Every line read is kept, dropped as a duplicate or listed as invalid: nothing disappears unexplained.
    const c = i.cleaning;
    expect(c.rowsKept + c.duplicates.length + c.invalid.length).toBe(c.rowsRead);
  });
});

describe('analyze(sample, region)', () => {
  it('deep-equals the Python reference for one region (fixture-region.ts, Jawa Tengah)', () => {
    expect(analyze(sample, 'Jawa Tengah')).toEqual(REGION_FIXTURE);
  });

  it('counts only that region, but keeps the company months and the company peer medians', () => {
    const all = analyze(sample);
    const jt = analyze(sample, 'Jawa Tengah');
    const sum = (xs: { netIdr: number }[]) => xs.reduce((s, x) => s + x.netIdr, 0);
    expect(jt.scope).toEqual({ region: 'Jawa Tengah' });
    expect(jt.period.months).toEqual(all.period.months);
    expect(jt.totals.netIdr).toBe(all.byRegion.find((r) => r.key === 'Jawa Tengah')!.netIdr);
    expect(sum(jt.byBranch)).toBe(jt.totals.netIdr);
    expect(sum(jt.byBrand)).toBe(jt.totals.netIdr);
    expect(jt.outlets.every((o) => o.region === 'Jawa Tengah')).toBe(true);
    for (const o of jt.outlets) {
      expect(o).toEqual(all.outlets.find((x) => x.outletId === o.outletId)); // same score as company-wide
    }
    expect(jt.cleaning).toEqual(all.cleaning); // data quality is about the whole file
  });

  it('a region with no lines gives an empty result, not a throw', () => {
    const none = analyze(sample, 'Papua');
    expect(none.totals.netIdr).toBe(0);
    expect(none.outlets).toEqual([]);
    expect(none.byBranch).toEqual([]);
  });
});

describe('round', () => {
  it('rounds the exact value, not value × 10', () => {
    expect(round(1.005, 2)).toBe(1); // 1.005 is 1.00499999… in binary, like Python's round
    expect(round(57.34, 1)).toBe(57.3);
    expect(Object.is(round(-0.04, 1), 0)).toBe(true); // never -0
  });
});

describe('metrics', () => {
  it('peer median of an even count is the mean of the middle two', () => {
    const i = analyze(
      csv(
        sale('A', 'Warung', '2026-09-01', 100),
        sale('B', 'Warung', '2026-09-01', 200),
        sale('C', 'Warung', '2026-09-01', 400),
        sale('D', 'Warung', '2026-09-01', 1000),
        sale('G', 'Grosir', '2026-09-01', 5000),
      ),
    );
    const a = i.outlets.find((o) => o.outletId === 'A')!;
    expect(a.peerMedianIdr).toBe(300);
    expect(a.peerIndex).toBe(0.3333);
    expect(i.outlets.find((o) => o.outletId === 'G')!.peerIndex).toBe(1);
  });

  it('weakest: lowest peerIndex, ties broken by lower net', () => {
    // A (100 of 200) and G (1000 of 2000) both score 0.5; A has the lower net, so it comes first.
    const i = analyze(
      csv(
        sale('G', 'Grosir', '2026-09-01', 1000),
        sale('H', 'Grosir', '2026-09-01', 3000),
        sale('A', 'Warung', '2026-09-01', 100),
        sale('B', 'Warung', '2026-09-01', 300),
      ),
    );
    expect(i.weakest.map((o) => [o.outletId, o.peerIndex])).toEqual([
      ['A', 0.5],
      ['G', 0.5],
      ['B', 1.5],
      ['H', 1.5],
    ]);
  });

  it('months: every month present, change null when the first month is 0, drops only for first-month sellers', () => {
    const i = analyze(
      csv(
        sale('A', 'Warung', '2026-09-03', 1000),
        sale('A', 'Warung', '2026-10-03', 250),
        sale('B', 'Warung', '2026-10-09', 800), // new in October: no drop, change null
        sale('C', 'Warung', '2026-09-10', 500), // nothing in October: the biggest drop
      ),
    );
    expect(i.period).toEqual({ from: '2026-09-03', to: '2026-10-09', months: ['2026-09', '2026-10'] });
    const b = i.outlets.find((o) => o.outletId === 'B')!;
    expect(b).toMatchObject({ firstMonthIdr: 0, lastMonthIdr: 800, changePct: null, lastOrder: '2026-10-09' });
    expect(i.biggestDrops.map((o) => o.outletId)).toEqual(['C', 'A']);
    expect(i.outlets.find((o) => o.outletId === 'C')!.changePct).toBe(-100);
    expect(i.totals.byMonth).toEqual({ '2026-09': 1500, '2026-10': 1050 });
    expect(i.totals.changePct).toBe(-30);
  });

  it('region driver: the branch with the largest rupiah change, even against the region', () => {
    const i = analyze(
      csv(
        sale('A', 'Warung', '2026-09-01', 1000, { branch: 'Malang' }),
        sale('A', 'Warung', '2026-10-01', 1300, { branch: 'Malang' }),
        sale('B', 'Warung', '2026-09-01', 5000, { branch: 'Surabaya' }),
        sale('B', 'Warung', '2026-10-01', 4500, { branch: 'Surabaya' }),
      ),
    );
    expect(i.byRegion[0].driver).toEqual({ branch: 'Surabaya', deltaIdr: -500, changePct: -10 });
    expect(i.byRegion[0].changePct).toBe(-3.3);
  });

  it('salesman: the one on most lines, ties to the first seen; invoices are distinct', () => {
    const i = analyze(
      csv(
        sale('A', 'Warung', '2026-09-01', 100, { salesman: 'Budi', invoice_no: 'I1' }),
        sale('A', 'Warung', '2026-09-02', 100, { salesman: 'Sari', invoice_no: 'I2' }),
        sale('A', 'Warung', '2026-09-02', 100, { salesman: 'Sari', invoice_no: 'I2', sku: 'other' }),
        sale('B', 'Warung', '2026-09-01', 100, { salesman: 'Dewi', invoice_no: 'I3' }),
        sale('B', 'Warung', '2026-09-02', 100, { salesman: 'Eko', invoice_no: 'I4' }),
      ),
    );
    expect(i.outlets.find((o) => o.outletId === 'A')).toMatchObject({ salesman: 'Sari', invoices: 2 });
    expect(i.outlets.find((o) => o.outletId === 'B')!.salesman).toBe('Dewi');
  });

  it('one month only: change 0 and no driver', () => {
    const i = analyze(csv(sale('A', 'Warung', '2026-09-01', 100)));
    expect(i.totals.changePct).toBe(0);
    expect(i.byRegion[0].driver).toBeUndefined();
  });
});
