import { cleanRows } from './clean';
import { readRows } from './csv';
import type { Breakdown, CleaningReport, Insights, OutletScore, SaleLine } from './types';

/**
 * Metrics over cleaned lines, exactly as docs/SPEC.md section 2 defines them. FIXTURE (src/lib/fixture.ts) is the
 * reference result for the sample; the tests hold this file to it.
 */

/** Parse, clean and measure one CSV export. Throws only when the file itself is unusable (see readRows). */
export function analyze(csvText: string): Insights {
  const { lines, report } = cleanRows(readRows(csvText));
  return computeInsights(lines, report);
}

/**
 * Round to `digits` decimals. toFixed rounds the exact binary value to the nearest decimal, which is what the
 * reference (Python's round) does; Math.round(x * 10) / 10 rounds x * 10, which already carries an error, and can
 * land one step off. A -0 becomes 0 so it compares equal to the reference.
 */
export function round(x: number, digits: number): number {
  const r = Number(x.toFixed(digits));
  return r === 0 ? 0 : r;
}

/** Last month vs first month in percent, 1 decimal; null when there is nothing to compare against. */
function changePct(first: number, last: number): number | null {
  return first === 0 ? null : round((last / first - 1) * 100, 1);
}

/** Median; for an even count the mean of the middle two. */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Group items by a key, keeping the order each key was first seen (that order is every tie-break below). */
function groupBy<T>(items: T[], key: (x: T) => string): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const x of items) {
    const k = key(x);
    const g = out.get(k);
    if (g) g.push(x);
    else out.set(k, [x]);
  }
  return out;
}

/** Net per month, with every month present (0 when nothing sold). */
function netByMonth(lines: SaleLine[], months: string[]): Record<string, number> {
  const out: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));
  for (const l of lines) out[l.month] += l.netIdr;
  return out;
}

/** Net per value of one dimension, high to low. Array.sort is stable, so equal totals keep first-seen order. */
function breakdown(
  lines: SaleLine[],
  key: (l: SaleLine) => string,
  months: string[],
  totalNet: number,
  withDriver: boolean,
): Breakdown[] {
  const first = months[0];
  const last = months[months.length - 1];
  const rows: Breakdown[] = [];
  for (const [k, group] of groupBy(lines, key)) {
    const netIdr = sum(group.map((l) => l.netIdr));
    const byMonth = netByMonth(group, months);
    const b: Breakdown = {
      key: k,
      netIdr,
      share: totalNet === 0 ? 0 : round(netIdr / totalNet, 4),
      byMonth,
      changePct: changePct(byMonth[first], byMonth[last]),
    };
    // The driver names the branch behind a region's move. With one month there is no move to explain.
    if (withDriver && months.length > 1) b.driver = driverBranch(group, months);
    rows.push(b);
  }
  return rows.sort((a, b) => b.netIdr - a.netIdr);
}

/**
 * The branch whose net changed most in absolute rupiah between the first and last month. Rupiah, not percent: a
 * small branch doubling moves the region less than a big one slipping 10%, and the region's change is in rupiah.
 * Ties keep the branch seen first.
 */
function driverBranch(lines: SaleLine[], months: string[]): NonNullable<Breakdown['driver']> {
  const first = months[0];
  const last = months[months.length - 1];
  let best: NonNullable<Breakdown['driver']> | undefined;
  for (const [branch, group] of groupBy(lines, (l) => l.branch)) {
    const byMonth = netByMonth(group, months);
    const deltaIdr = byMonth[last] - byMonth[first];
    if (!best || Math.abs(deltaIdr) > Math.abs(best.deltaIdr)) {
      best = { branch, deltaIdr, changePct: changePct(byMonth[first], byMonth[last]) };
    }
  }
  return best!;
}

/** The value on most lines, ignoring blanks; ties go to the value seen first. '' only when every line is blank. */
function mostCommon(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) if (v !== '') counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = '';
  let bestCount = 0;
  for (const [v, n] of counts) {
    if (n > bestCount) [best, bestCount] = [v, n]; // strict >: the first-seen value keeps a tie
  }
  return best;
}

/** Invoice numbers count orders; a return note is not an order. */
const distinctOrders = (lines: SaleLine[]) => new Set(lines.filter((l) => !l.isReturn).map((l) => l.invoiceNo)).size;

/**
 * Weakest first: lowest peerIndex, then lower net (the stable sort keeps first-seen order after that).
 * Why peers and not raw totals: a warung sells less than a grosir by nature, so raw totals would only ever flag
 * small shops. Against the median of its own type, an outlet is weak for its kind.
 */
const weakestFirst = (a: OutletScore, b: OutletScore) => a.peerIndex - b.peerIndex || a.netIdr - b.netIdr;

function scoreOutlets(lines: SaleLine[], months: string[]): OutletScore[] {
  const first = months[0];
  const last = months[months.length - 1];
  const base = [...groupBy(lines, (l) => l.outletId)].map(([outletId, group]) => {
    // Name, type, region and branch do not vary within one outlet id once cleaned, so the first line speaks for all.
    const head = group[0];
    const byMonth = netByMonth(group, months);
    return {
      outletId,
      outletName: head.outletName,
      outletType: head.outletType,
      region: head.region,
      branch: head.branch,
      salesman: mostCommon(group.map((l) => l.salesman)),
      netIdr: sum(group.map((l) => l.netIdr)),
      invoices: distinctOrders(group),
      firstMonthIdr: byMonth[first],
      lastMonthIdr: byMonth[last],
      changePct: changePct(byMonth[first], byMonth[last]),
      // ISO dates compare as text, so the largest string is the latest date.
      lastOrder: group.reduce((d, l) => (l.date > d ? l.date : d), head.date),
    };
  });

  const medianByType = new Map<string, number>();
  for (const [type, peers] of groupBy(base, (o) => o.outletType)) {
    medianByType.set(type, median(peers.map((o) => o.netIdr)));
  }

  return base
    .map((o): OutletScore => {
      const peerMedianIdr = medianByType.get(o.outletType)!;
      // A type whose median outlet sold nothing (or less, after returns) gives no yardstick: its outlets score 0,
      // so they surface for a look instead of dividing by zero.
      const peerIndex = peerMedianIdr > 0 ? round(o.netIdr / peerMedianIdr, 4) : 0;
      return { ...o, peerMedianIdr, peerIndex };
    })
    .sort(weakestFirst);
}

/** Every figure on the dashboard, from cleaned lines. No usable lines gives an all-zero result, never a throw. */
export function computeInsights(lines: SaleLine[], cleaning: CleaningReport): Insights {
  const months = [...new Set(lines.map((l) => l.month))].sort();
  const first = months[0];
  const last = months[months.length - 1];
  const dates = lines.map((l) => l.date).sort();

  const netIdr = sum(lines.map((l) => l.netIdr));
  const byMonth = netByMonth(lines, months);
  const outlets = scoreOutlets(lines, months);

  // Biggest drops: only an outlet that sold in the first month can drop. The ratio is sorted unrounded.
  const biggestDrops = outlets
    .filter((o) => o.firstMonthIdr > 0)
    .map((o) => ({ o, ratio: o.lastMonthIdr / o.firstMonthIdr }))
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 5)
    .map(({ o }) => o);

  return {
    period: { from: dates[0] ?? '', to: dates[dates.length - 1] ?? '', months },
    totals: {
      netIdr,
      grossIdr: sum(lines.map((l) => l.grossIdr)),
      discountIdr: sum(lines.map((l) => l.discountIdr)),
      returnsIdr: sum(lines.filter((l) => l.isReturn).map((l) => l.netIdr)),
      invoices: distinctOrders(lines),
      outlets: new Set(lines.map((l) => l.outletId)).size,
      cartons: sum(lines.map((l) => l.qtyCarton)),
      byMonth,
      changePct: months.length === 0 ? null : changePct(byMonth[first], byMonth[last]),
    },
    byRegion: breakdown(lines, (l) => l.region, months, netIdr, true),
    byBrand: breakdown(lines, (l) => l.brand, months, netIdr, false),
    weakest: outlets.slice(0, 5),
    biggestDrops,
    outlets,
    cleaning,
  };
}
