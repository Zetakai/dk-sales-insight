#!/usr/bin/env node
/**
 * Writes data/demo.csv: a SYNTHETIC two-month sales export with the same columns as the real one, so a fresh clone
 * runs without anyone's real data. Outlets, salesmen, invoices and every number are made up; the region and brand
 * names are public. Seeded, so the file is identical on every run.
 *
 * It carries the same kinds of problems real exports have, so the data-quality panel has something to show:
 * an exact duplicate line, region spelling variants, a trailing space in an outlet name, a return with a negative
 * quantity, one outlet name shared by two outlet ids, and two lines with no salesman.
 *
 *   node scripts/make-demo.mjs
 */
import { writeFileSync } from 'node:fs';

let seed = 20261101;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
/** Two different words from a list ("Toko Maju Lestari", never "Toko Maju Maju"). */
const twoOf = (a) => {
  const first = pick(a);
  let second = pick(a);
  while (second === first) second = pick(a);
  return `${first} ${second}`;
};

const REGIONS = {
  Jabodetabek: ['Jakarta Timur', 'Depok', 'Bogor'],
  'Jawa Barat': ['Bandung', 'Tasikmalaya'],
  'Jawa Tengah': ['Semarang', 'Purwokerto'],
  'Jawa Timur': ['Surabaya', 'Kediri'],
  Sumatera: ['Pekanbaru', 'Lampung'],
  Kalimantan: ['Pontianak', 'Samarinda'],
};
// Relative demand per region and a first-to-second-month trend, so the charts have a story to tell.
const REGION_WEIGHT = { Jabodetabek: 1.6, 'Jawa Barat': 1.2, 'Jawa Tengah': 0.9, 'Jawa Timur': 1.0, Sumatera: 0.8, Kalimantan: 0.6 };
const REGION_TREND = { Jabodetabek: 1.06, 'Jawa Barat': 0.92, 'Jawa Tengah': 1.0, 'Jawa Timur': 1.18, Sumatera: 0.95, Kalimantan: 0.9 };

const SKUS = [
  ['Kacang Dua Kelinci', 'Kacang Atom 250g', 210000],
  ['Kacang Dua Kelinci', 'Kacang Kulit 200g', 240000],
  ['Kacang Dua Kelinci', 'Kacang Garing 150g', 180000],
  ['Sukro', 'Sukro Original 100g', 170000],
  ['Sukro', 'Sukro Balado 100g', 175000],
  ['Tos Tos', 'Tos Tos Jagung Bakar 140g', 250000],
  ['Tic Tac', 'Tic Tac Sapi Panggang 100g', 160000],
  ['Pilus', 'Pilus Pedas 95g', 150000],
  ['Usagi', 'Usagi Snack Keju 60g', 140000],
];
const TYPES = [
  ['Grosir', 6, 12],
  ['Minimarket', 2, 5],
  ['Toko Kelontong', 1, 4],
  ['Warung', 1, 3],
];
const FIRST = ['Ahmad', 'Bayu', 'Clara', 'Dian', 'Eko', 'Fitri', 'Galih', 'Hana', 'Irfan', 'Juli', 'Kurnia', 'Lina', 'Mario', 'Nur', 'Oki', 'Putri'];
const SHOP = ['Maju', 'Sejahtera', 'Bahagia', 'Cahaya', 'Mandala', 'Harapan', 'Sentosa', 'Rejeki', 'Pelangi', 'Mitra', 'Lestari', 'Bintang'];

const outlets = [];
let id = 2001;
for (const [region, branches] of Object.entries(REGIONS)) {
  for (const branch of branches) {
    const salesman = pick(FIRST);
    for (let k = 0; k < 4; k++) {
      const [type, lo, hi] = TYPES[k % 4];
      outlets.push({ id: `D${id++}`, name: `${type === 'Grosir' ? 'Grosir' : type === 'Warung' ? 'Warung' : type === 'Minimarket' ? 'Mini' : 'Toko'} ${twoOf(SHOP)}`, type, region, branch, salesman, lo, hi, health: rnd() < 0.15 ? 0.15 : 1 });
    }
  }
}
// One name shared by two outlet ids (a real-world pattern the app must not merge).
outlets[5].name = outlets[17].name;

const rows = [];
let inv = 700001;
const days = (m) => (m === 9 ? 30 : 31);
for (const month of [9, 10]) {
  for (let d = 1; d <= days(month); d++) {
    const date = `2026-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    for (const o of outlets) {
      const p = 0.18 * REGION_WEIGHT[o.region] * (month === 10 ? REGION_TREND[o.region] : 1) * o.health;
      if (rnd() > p) continue;
      const invoice = `INV${inv++}`;
      const lines = int(1, 3);
      // Distinct products within one invoice: a repeated product with the same quantity would be an accidental
      // exact duplicate, and the file should carry exactly one, on purpose (below).
      const chosen = [...SKUS].sort(() => rnd() - 0.5).slice(0, lines);
      for (const [brand, sku, price] of chosen) {
        const qty = int(o.lo, o.hi);
        const gross = qty * price;
        const discount = o.type === 'Grosir' && rnd() < 0.4 ? Math.round(gross * 0.03) : 0;
        rows.push([date, invoice, o.region, o.branch, o.id, o.name, o.type, o.salesman, brand, sku, qty, price, gross, discount, gross - discount]);
      }
    }
  }
}

// The kinds of problems a real export carries.
rows[40][2] = 'JAWA BARAT' === rows[40][2].toUpperCase() ? 'JAWA BARAT' : rows[40][2].toUpperCase(); // shouted region
const jb = rows.findIndex((r) => r[2] === 'Jawa Barat');
rows[jb][2] = 'Jabar'; // abbreviation
const ts = rows.findIndex((r, i) => i > 100 && r[6] === 'Grosir');
rows[ts][5] = `${rows[ts][5]} `; // trailing space
rows[500][7] = ''; // no salesman: the sale counts, nobody owns it
rows[800][7] = '';
rows.splice(300, 0, [...rows[299]]); // exact duplicate line
const ret = rows.find((r) => r[6] === 'Warung');
rows.push(['2026-10-15', 'RTR900101', ret[2], ret[3], ret[4], ret[5], ret[6], ret[7], ret[8], ret[9], -1, ret[11], -ret[11], 0, -ret[11]]);
rows.sort((a, b) => a[0].localeCompare(b[0]));

const head = 'date,invoice_no,region,branch,outlet_id,outlet_name,outlet_type,salesman,brand,sku,qty_carton,price_per_carton_idr,gross_sales_idr,discount_idr,net_sales_idr';
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
writeFileSync(new URL('../data/demo.csv', import.meta.url), [head, ...rows.map((r) => r.map(esc).join(','))].join('\n') + '\n');
console.log(`data/demo.csv: ${rows.length} lines, ${outlets.length} outlets (synthetic)`);
