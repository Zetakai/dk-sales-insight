import { formatIdr, formatMonth, formatPct } from './format';
import type { Breakdown, Insights, Lang, OutletScore } from './types';

/**
 * The one-paragraph Telegram summary (docs/SPEC.md section 3). Plain text, no Markdown: a plain paste into
 * Telegram shows * and _ literally. At most 900 characters, so it reads on a phone without "show more".
 * Written the way a sales head posts in the team group: short clauses, numbers first, one action.
 */

export const SUMMARY_MAX_CHARS = 900;

const T = {
  id: {
    sales: 'Penjualan',
    net: 'net',
    up: 'naik',
    down: 'turun',
    flat: 'stabil',
    vs: 'dari',
    highest: 'tertinggi',
    lowest: 'terendah',
    ofTotal: 'dari total',
    drivenBy: 'didorong',
    draggedBy: 'terseret',
    despite: 'meski',
    holds: (brand: string, share: string) => `${brand} pegang ${share} penjualan`,
    alsoMovedMost: 'dan paling bergerak,',
    movedMost: 'paling bergerak,',
    weakest: (n: number) => `${n} outlet terlemah dibanding sesama tipenya`,
    action: 'prioritaskan kunjungan minggu ini',
    note: 'Catatan data',
    dupes: (n: number) => `${n} baris ganda dibuang`,
    returns: (n: number, amt: string) => `${n} retur (${amt}) dipotong`,
    spellings: (n: number) => `ejaan wilayah di ${n} baris diseragamkan`,
    invalid: (n: number) => `${n} baris rusak dilewati`,
    empty: (n: number) =>
      n > 0
        ? `Belum ada baris penjualan yang bisa dihitung: ${n} baris rusak dilewati, cek file-nya.`
        : 'Belum ada baris penjualan yang bisa dihitung, cek file-nya.',
  },
  en: {
    sales: 'Sales',
    net: 'net',
    up: 'up',
    down: 'down',
    flat: 'flat',
    vs: 'on',
    highest: 'highest',
    lowest: 'lowest',
    ofTotal: 'of total',
    drivenBy: 'driven by',
    draggedBy: 'dragged by',
    despite: 'despite',
    holds: (brand: string, share: string) => `${brand} holds ${share} of sales`,
    alsoMovedMost: 'and moved most,',
    movedMost: 'moved most,',
    weakest: (n: number) => `Weakest ${n} outlet${n === 1 ? '' : 's'} against their own type`,
    action: 'prioritise visits this week',
    note: 'Data note',
    dupes: (n: number) => `${n} duplicate line${n === 1 ? '' : 's'} removed`,
    returns: (n: number, amt: string) => `${n} return${n === 1 ? '' : 's'} (${amt}) deducted`,
    spellings: (n: number) => `region spelling fixed on ${n} line${n === 1 ? '' : 's'}`,
    invalid: (n: number) => `${n} bad row${n === 1 ? '' : 's'} skipped`,
    empty: (n: number) =>
      n > 0
        ? `No sales lines could be counted: ${n} bad row${n === 1 ? '' : 's'} skipped, check the file.`
        : 'No sales lines could be counted, check the file.',
  },
} as const;

type Words = (typeof T)[Lang];

/** "1 Sep–31 Okt 2026"; one month: "1–30 Sep 2026"; across a year end: "15 Des 2026–31 Jan 2027". */
export function periodLabel(from: string, to: string, lang: Lang): string {
  const [fy, , fd] = from.split('-');
  const [ty, , td] = to.split('-');
  const mon = (d: string) => formatMonth(d.slice(0, 7), lang, false);
  if (from === to) return `${Number(td)} ${mon(to)} ${ty}`;
  if (from.slice(0, 7) === to.slice(0, 7)) return `${Number(fd)}–${Number(td)} ${mon(to)} ${ty}`;
  if (fy === ty) return `${Number(fd)} ${mon(from)}–${Number(td)} ${mon(to)} ${ty}`;
  return `${Number(fd)} ${mon(from)} ${fy}–${Number(td)} ${mon(to)} ${ty}`;
}

/** "naik 0,3%" / "down 35.3%" / "stabil". */
function move(p: number, w: Words, lang: Lang): string {
  if (p === 0) return w.flat;
  return `${p > 0 ? w.up : w.down} ${formatPct(Math.abs(p), lang, false)}`;
}

/** Rupiah change with its sign: "+Rp26,8 jt" / "−Rp5 jt". */
const signedIdr = (d: number, lang: Lang) => `${d > 0 ? '+' : ''}${formatIdr(d, lang)}`;

/** Change of one breakdown row between the first and last month, in rupiah. */
const delta = (b: Breakdown, first: string, last: string) => (b.byMonth[last] ?? 0) - (b.byMonth[first] ?? 0);

/**
 * The row that moved most, by absolute rupiah. Rupiah, not percent: a small region or brand doubling from almost
 * nothing is not the news of the month; the move that changed the total is. undefined when nothing moved.
 */
function biggestMover(rows: Breakdown[], first: string, last: string): Breakdown | undefined {
  let best: Breakdown | undefined;
  for (const b of rows) {
    if (delta(b, first, last) === 0) continue;
    if (!best || Math.abs(delta(b, first, last)) > Math.abs(delta(best, first, last))) best = b;
  }
  return best;
}

/**
 * An outlet as a manager names it: its name, plus the branch when other outlet ids carry the same name (several
 * shops can be called "Toko Makmur"), plus the id as well when the branch does not tell them apart either (two
 * "Toko Makmur" in one branch).
 */
function outletLabel(o: OutletScore, i: Insights, maxName: number): string {
  const name = o.outletName.length > maxName ? `${o.outletName.slice(0, maxName - 1).trimEnd()}…` : o.outletName;
  if (!i.cleaning.sharedNames.some((s) => s.name === o.outletName)) return name;
  const sameBranch = i.outlets.filter((x) => x.outletName === o.outletName && x.branch === o.branch).length;
  return `${name} (${sameBranch > 1 ? `${o.branch}, ${o.outletId}` : o.branch})`;
}

/** How much to say. Level 0 says everything; each level drops the least needed part to fit 900 characters. */
type Detail = { note: boolean; brandMover: boolean; lowestRegion: boolean; maxName: number };
const LEVELS: Detail[] = [
  { note: true, brandMover: true, lowestRegion: true, maxName: 60 },
  { note: false, brandMover: true, lowestRegion: true, maxName: 60 },
  { note: false, brandMover: false, lowestRegion: false, maxName: 60 },
  { note: false, brandMover: false, lowestRegion: false, maxName: 28 },
];

function compose(i: Insights, lang: Lang, d: Detail): string {
  const w = T[lang];
  const { months } = i.period;
  const first = months[0];
  const last = months[months.length - 1];
  const twoMonths = months.length > 1;
  const sameYear = first.slice(0, 4) === last.slice(0, 4);
  const mon = (m: string) => formatMonth(m, lang, !sameYear);
  const parts: string[] = [];

  // 1. Period, net, and the change last month vs first month.
  let head = `${w.sales} ${periodLabel(i.period.from, i.period.to, lang)}: ${w.net} ${formatIdr(i.totals.netIdr, lang)}`;
  if (twoMonths && i.totals.changePct !== null) {
    head += `, ${mon(last)} ${move(i.totals.changePct, w, lang)} ${w.vs} ${mon(first)}`;
  }
  parts.push(`${head}.`);

  // 2. Strongest and weakest region, then the region that moved most and the branch behind it.
  const regions = i.byRegion;
  if (regions.length > 0) {
    const top = regions[0];
    let s = `${top.key} ${w.highest} (${formatIdr(top.netIdr, lang)}, ${formatPct(top.share * 100, lang, false)} ${w.ofTotal})`;
    if (d.lowestRegion && regions.length > 1) {
      const low = regions[regions.length - 1];
      s += `, ${low.key} ${w.lowest} (${formatIdr(low.netIdr, lang)})`;
    }
    parts.push(`${s}.`);
  }
  const mover = twoMonths ? biggestMover(regions, first, last) : undefined;
  if (mover) {
    const md = delta(mover, first, last);
    let s = `${mover.key} ${mover.changePct !== null ? move(mover.changePct, w, lang) : signedIdr(md, lang)}`;
    const dr = mover.driver;
    if (dr && dr.deltaIdr !== 0) {
      const drMove = dr.changePct !== null ? `${formatPct(dr.changePct, lang)} (${signedIdr(dr.deltaIdr, lang)})` : signedIdr(dr.deltaIdr, lang);
      // The branch that moved most can move against its region; then it is a "despite", not the cause.
      const verb = Math.sign(dr.deltaIdr) !== Math.sign(md) ? w.despite : md > 0 ? w.drivenBy : w.draggedBy;
      s += `, ${verb} ${dr.branch} ${drMove}`;
    }
    parts.push(`${s}.`);
  }

  // 3. The top brand and its share, and the brand that moved most.
  const brands = i.byBrand;
  if (brands.length > 0) {
    const top = brands[0];
    let s = w.holds(top.key, formatPct(top.share * 100, lang, false));
    const bm = d.brandMover && twoMonths ? biggestMover(brands, first, last) : undefined;
    if (bm) {
      const how = bm.changePct !== null ? move(bm.changePct, w, lang) : signedIdr(delta(bm, first, last), lang);
      s += bm === top ? ` ${w.alsoMovedMost} ${how}` : `; ${bm.key} ${w.movedMost} ${how}`;
    }
    parts.push(`${s}.`);
  }

  // 4. The weakest outlets against their own type, and the one action.
  if (i.weakest.length > 0) {
    const names = i.weakest.map((o) => outletLabel(o, i, d.maxName)).join(', ');
    parts.push(`${w.weakest(i.weakest.length)}: ${names}; ${w.action}.`);
  }

  // 5. One short data note, only when cleaning changed something.
  if (d.note) {
    const c = i.cleaning;
    const notes: string[] = [];
    if (c.duplicates.length > 0) notes.push(w.dupes(c.duplicates.length));
    if (c.returns.length > 0) notes.push(w.returns(c.returns.length, formatIdr(Math.abs(i.totals.returnsIdr), lang)));
    const fixedRows = c.regionFixes.reduce((n, f) => n + f.rows, 0);
    if (fixedRows > 0) notes.push(w.spellings(fixedRows));
    if (c.invalid.length > 0) notes.push(w.invalid(c.invalid.length));
    if (notes.length > 0) parts.push(`${w.note}: ${notes.join(', ')}.`);
  }

  return parts.join(' ');
}

/** One paragraph, plain text, ready to paste into a Telegram group. */
export function telegramSummary(i: Insights, lang: Lang = 'id'): string {
  if (i.period.months.length === 0) return T[lang].empty(i.cleaning.invalid.length);
  for (const level of LEVELS) {
    const text = compose(i, lang, level);
    if (text.length <= SUMMARY_MAX_CHARS) return text;
  }
  // Only reachable with absurdly long names; cut at a word so the paste still fits.
  const text = compose(i, lang, LEVELS[LEVELS.length - 1]);
  const cut = text.slice(0, SUMMARY_MAX_CHARS - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 1))}…`;
}
