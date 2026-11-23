import { formatIdr, formatIdrFull, formatMonth, formatPct } from '../lib';
import type { Insights, Lang, OutletScore } from '../lib';
import type { Strings } from './i18n';

/**
 * Number and date wording for one language. Every rupiah, percent and month goes through src/lib/format.ts, so a
 * figure reads the same on the page and in the Telegram summary.
 */
export function makeFormat(lang: Lang) {
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  const monthShort = (m: string) => formatMonth(m, lang, false);
  const day = (iso: string, withYear = false) => {
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${Number(d)} ${monthShort(`${y}-${m}`)}${withYear ? ` ${y}` : ''}`;
  };
  return {
    lang,
    idr: (n: number) => formatIdr(n, lang),
    idrFull: (n: number) => formatIdrFull(n, lang),
    pct: (p: number | null) => formatPct(p, lang),
    /** A 0..1 share or ratio as an unsigned percent: 0.4286 -> "42.9%" / "42,9%". */
    ratio: (r: number) => formatPct(r * 100, lang, false),
    /** "+Rp26.8M" / "−Rp5 jt": formatIdr signs negatives; positives get an explicit plus. */
    signedIdr: (n: number) => (n > 0 ? '+' : '') + formatIdr(n, lang),
    /** Plain counts (outlets, invoices, rows): no unit, local grouping. */
    count: (n: number) => n.toLocaleString(locale),
    monthShort,
    monthLong: (m: string) => formatMonth(m, lang),
    /** "2026-10-31" -> "31 Oct" / "31 Okt" (optionally with the year). */
    day,
    /** "1 Sep – 31 Oct 2026"; the year shows once when both ends share it. */
    period: (p: Insights['period']) => {
      if (!p.from || !p.to) return '';
      if (p.from === p.to) return day(p.from, true);
      const sameYear = p.from.slice(0, 4) === p.to.slice(0, 4);
      return `${day(p.from, !sameYear)} – ${day(p.to, true)}`;
    },
  };
}

export type Format = ReturnType<typeof makeFormat>;

/** First and last month of the data; `two` is false when the file covers one month only. */
export function monthsOf(i: Insights) {
  const m = i.period.months;
  return { first: m[0] ?? '', last: m[m.length - 1] ?? '', two: m.length >= 2 };
}

/** "Oct vs Sep" / "Okt vs Sep": the label every change on the page refers to. */
export function changeLabel(i: Insights, f: Format, t: Strings): string {
  const { first, last, two } = monthsOf(i);
  return two ? t.vs(f.monthShort(last), f.monthShort(first)) : t.change;
}

/** A blank salesman in the source shows as a dash, never as an empty gap. */
export const orDash = (s: string) => (s.trim() ? s : '–');

function daysBetween(a: string, b: string): number {
  const t = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
  };
  return Math.round((t(b) - t(a)) / 86_400_000);
}

export type OutletMode = 'peers' | 'drops';

/** One plain sentence: why this outlet is on the list. Facts only, no guessing at causes. */
export function outletReason(o: OutletScore, mode: OutletMode, i: Insights, f: Format, t: Strings): string {
  const { first, last, two } = monthsOf(i);
  const type = o.outletType.toLowerCase();
  const idle = i.period.to && o.lastOrder ? daysBetween(o.lastOrder, i.period.to) : 0;
  const idleSince = idle >= 14 ? f.day(o.lastOrder) : null;

  if (mode === 'drops') {
    return t.reasonDrops({
      type,
      last: f.monthShort(last),
      lastIdr: f.idr(o.lastMonthIdr),
      first: f.monthShort(first),
      firstIdr: f.idr(o.firstMonthIdr),
      abovePeers: o.peerIndex >= 1,
      idleSince,
    });
  }

  const c = o.changePct;
  const trend =
    two && c !== null && Math.abs(c) >= 10
      ? {
          dir: c > 0 ? ('up' as const) : ('down' as const),
          pct: formatPct(c, f.lang, false),
          month: f.monthShort(last),
        }
      : null;
  return t.reasonPeers({
    type,
    times: o.netIdr > 0 ? o.peerMedianIdr / o.netIdr : 0,
    // One decimal: 1.5 must not read as "2 times as much".
    timesText: o.netIdr > 0 ? (Math.round((o.peerMedianIdr / o.netIdr) * 10) / 10).toLocaleString(f.lang === 'id' ? 'id-ID' : 'en-US') : '0',
    median: f.idr(o.peerMedianIdr),
    net: f.idr(o.netIdr),
    trend,
    idleSince,
  });
}
