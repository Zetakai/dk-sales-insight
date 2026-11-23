import type { Lang } from './types';

/**
 * Display helpers shared by the UI and the Telegram summary, so a number reads the same everywhere.
 * Indonesian uses the local units sales teams say out loud (rb, jt, M = miliar) and comma decimals.
 */
const UNITS: Record<Lang, Array<[number, string]>> = {
  id: [
    [1e9, ' M'],
    [1e6, ' jt'],
    [1e3, ' rb'],
  ],
  en: [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ],
};

const locale = (lang: Lang) => (lang === 'id' ? 'id-ID' : 'en-US');

/** Compact rupiah: Rp1,2 M / Rp54,2 jt / Rp813 jt / Rp170 rb (id), Rp1.2B / Rp54.2M / Rp813M / Rp170K (en). */
export function formatIdr(n: number, lang: Lang = 'id'): string {
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  for (const [div, unit] of UNITS[lang]) {
    if (a >= div) {
      const v = a / div;
      const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2;
      return `${sign}Rp${v.toLocaleString(locale(lang), { maximumFractionDigits: digits, minimumFractionDigits: 0 })}${unit}`;
    }
  }
  return `${sign}Rp${a.toLocaleString(locale(lang))}`;
}

/** Full rupiah with grouping: Rp1.234.500 (id) / Rp1,234,500 (en). */
export function formatIdrFull(n: number, lang: Lang = 'id'): string {
  const sign = n < 0 ? '−' : '';
  return `${sign}Rp${Math.abs(n).toLocaleString(locale(lang))}`;
}

/** Signed percent, always one decimal so columns line up: +0,3% / +38,0% (id), +0.3% (en). null -> "–". */
export function formatPct(p: number | null, lang: Lang = 'id', signed = true): string {
  if (p === null || !Number.isFinite(p)) return '–';
  const s = Math.abs(p).toLocaleString(locale(lang), { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const sign = !signed ? '' : p > 0 ? '+' : p < 0 ? '−' : '';
  return `${sign}${s}%`;
}

const MONTHS: Record<Lang, string[]> = {
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2026-09" -> "Sep 2026" (en) / "Sep 2026" (id); "2026-10" -> "Okt 2026" (id). */
export function formatMonth(month: string, lang: Lang = 'id', withYear = true): string {
  const [y, m] = month.split('-');
  const name = MONTHS[lang][Number(m) - 1] ?? month;
  return withYear ? `${name} ${y}` : name;
}
