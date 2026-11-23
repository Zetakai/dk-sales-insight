import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FIXTURE } from './fixture';
import { analyze } from './metrics';
import { periodLabel, telegramSummary } from './summary';
import type { Insights, Lang } from './types';

const sample = readFileSync(new URL('../../data/demo.csv', import.meta.url), 'utf8');
const insights = analyze(sample);

const PERIOD: Record<Lang, string> = { id: '1 Sep–31 Okt 2026', en: '1 Sep–31 Oct 2026' };
const ACTION: Record<Lang, string> = { id: 'prioritaskan kunjungan minggu ini', en: 'prioritise visits this week' };

describe.each(['id', 'en'] as const)('telegramSummary(sample, %s)', (lang) => {
  const text = telegramSummary(insights, lang);

  it('is one plain-text paragraph of at most 900 characters', () => {
    expect(text).not.toMatch(/[\r\n]/);
    expect(text.length).toBeLessThanOrEqual(900);
    expect(text).not.toMatch(/[*_`#]/);
  });

  it('names the period, the top region and the biggest mover with its driver branch', () => {
    expect(text).toContain(PERIOD[lang]);
    expect(text.startsWith(lang === 'id' ? 'Penjualan 1 Sep' : 'Sales 1 Sep')).toBe(true);
    expect(text).toContain(insights.byRegion[0].key);
    expect(text).toMatch(/Jawa Tengah (naik|up) 57[.,]3%, (didorong|driven by) Semarang \+259[.,]8% \(\+Rp26[.,]8 ?(jt|M)\)/);
  });

  it('lists all 5 weakest outlets, with the branch beside a shared name, and the action', () => {
    for (const o of insights.weakest) expect(text).toContain(o.outletName);
    expect(text).toContain('Warung Pelangi Harapan (Semarang)'); // another outlet id carries the same name
    expect(text).toContain('Toko Cahaya Lestari,'); // a unique name needs no branch
    expect(text).toContain(ACTION[lang]);
  });

  it('keeps the content order: period, regions, brands, outlets, data note', () => {
    const at = (s: string) => text.indexOf(s);
    const order = [PERIOD[lang], 'Jabodetabek', 'Semarang', 'Kacang Dua Kelinci', 'Warung Pelangi Harapan', lang === 'id' ? 'Catatan data' : 'Data note'];
    const positions = order.map(at);
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('ends with the data note: duplicates, the return and the spellings', () => {
    expect(text).toMatch(lang === 'id' ? /1 baris ganda dibuang, 1 retur \(Rp170 rb\) dipotong/ : /1 duplicate line removed, 1 return \(Rp170K\) deducted/);
    expect(text).toContain(lang === 'id' ? 'ejaan wilayah di 2 baris diseragamkan.' : 'region spelling fixed on 2 lines.');
  });

  it('matches what the FIXTURE gives (the UI may render either)', () => {
    expect(telegramSummary(FIXTURE, lang)).toBe(text);
  });

  it('stays under 900 characters with very long outlet names', () => {
    const long: Insights = {
      ...insights,
      weakest: insights.weakest.map((o) => ({ ...o, outletName: `${o.outletName} ${'Sumber Rejeki Makmur Jaya '.repeat(8)}` })),
    };
    const t = telegramSummary(long, lang);
    expect(t.length).toBeLessThanOrEqual(900);
    expect(t).toContain(ACTION[lang]);
  });
});

describe.each(['id', 'en'] as const)('telegramSummary(sample, %s, lines)', (lang) => {
  const para = telegramSummary(insights, lang);
  const text = telegramSummary(insights, lang, 'lines');

  it('is the paragraph in blocks: headline, regions and brands, numbered outlets, data note', () => {
    const blocks = text.split('\n\n');
    expect(blocks).toHaveLength(4);
    expect(para.startsWith(`${blocks[0]} `)).toBe(true);
    expect(blocks[1].split('\n')).toHaveLength(3); // top region, the mover, the brands
    const outlets = blocks[2].split('\n');
    expect(outlets.slice(1, 6).map((l) => l.slice(0, 3))).toEqual(['1. ', '2. ', '3. ', '4. ', '5. ']);
    expect(outlets[6]).toBe(lang === 'id' ? 'Prioritaskan kunjungan minggu ini.' : 'Prioritise visits this week.');
    expect(blocks[3]).toMatch(lang === 'id' ? /^Catatan data:/ : /^Data note:/);
  });

  it('says the same words as the paragraph, stays plain text and under 900 characters', () => {
    const words = (s: string) => s.replace(/\d+\. /g, '').replace(/[;:,.\s]+/g, ' ').toLowerCase().trim();
    expect(words(text)).toBe(words(para));
    expect(text).not.toMatch(/[*_`#]/);
    expect(text.length).toBeLessThanOrEqual(900);
  });
});

describe('telegramSummary for one region', () => {
  const jt = analyze(sample, 'Jawa Tengah');

  it.each(['id', 'en'] as const)('names the region, compares its branches, lists its outlets, no file note (%s)', (lang) => {
    const text = telegramSummary(jt, lang);
    expect(text.startsWith(`${lang === 'id' ? 'Penjualan' : 'Sales'} Jawa Tengah 1 Sep`)).toBe(true);
    expect(text).toContain(jt.byBranch[0].key);
    expect(jt.byBranch.map((b) => b.key).every((b) => ['Semarang', 'Purwokerto'].includes(b))).toBe(true);
    for (const o of jt.weakest) expect(text).toContain(o.outletName);
    expect(text).not.toMatch(/Catatan data|Data note/);
    expect(text.length).toBeLessThanOrEqual(900);
  });
});

describe('telegramSummary, other cases', () => {
  it('defaults to Indonesian', () => {
    expect(telegramSummary(insights)).toBe(telegramSummary(insights, 'id'));
  });

  it('says plainly when no line could be counted', () => {
    const empty = analyze('date,invoice_no,region,branch,outlet_id,outlet_name,outlet_type,salesman,brand,sku,qty_carton,price_per_carton_idr,gross_sales_idr,discount_idr,net_sales_idr\n2026-09-01,,,,,,,,,,x,,,,\n');
    expect(telegramSummary(empty, 'id')).toBe('Belum ada baris penjualan yang bisa dihitung: 1 baris rusak dilewati, cek file-nya.');
    expect(telegramSummary(empty, 'en')).toBe('No sales lines could be counted: 1 bad row skipped, check the file.');
  });

  it('a branch moving against its region is a "despite", not a driver', () => {
    const i: Insights = structuredClone(insights);
    const jateng = i.byRegion.find((r) => r.key === 'Jawa Tengah')!;
    jateng.driver = { branch: 'Purwokerto', deltaIdr: -5000000, changePct: -10 };
    expect(telegramSummary(i, 'en')).toContain('Jawa Tengah up 57.3%, despite Purwokerto −10.0% (−Rp5M)');
  });

  it('adds the outlet id when the branch does not tell two same-named outlets apart', () => {
    const i: Insights = structuredClone(insights);
    const o = i.weakest[1];
    const twin = { ...o, outletId: 'D9999', netIdr: o.netIdr * 50 };
    i.outlets.push(twin);
    i.cleaning.sharedNames.push({ name: o.outletName, outletIds: [o.outletId, twin.outletId] });
    expect(telegramSummary(i, 'en')).toContain(`${o.outletName} (${o.branch}, ${o.outletId})`);
  });
});

describe('periodLabel', () => {
  it('writes the period the way a person says it', () => {
    expect(periodLabel('2026-09-01', '2026-10-31', 'id')).toBe('1 Sep–31 Okt 2026');
    expect(periodLabel('2026-09-01', '2026-09-30', 'en')).toBe('1–30 Sep 2026');
    expect(periodLabel('2026-12-15', '2027-01-31', 'id')).toBe('15 Des 2026–31 Jan 2027');
    expect(periodLabel('2026-09-05', '2026-09-05', 'en')).toBe('5 Sep 2026');
  });
});
