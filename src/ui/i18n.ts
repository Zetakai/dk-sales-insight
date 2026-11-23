import type { Lang, RowProblem } from '../lib';

/**
 * Every string the page shows, in both languages, in one place. Default language is Indonesian (the sales team's
 * own); English is one tap away in the header. Numbers, months and rupiah are never written here: they come in as
 * already-formatted arguments from text.ts (src/lib/format.ts underneath), so they follow the same language.
 */

const COLUMNS =
  'date, invoice_no, region, branch, outlet_id, outlet_name, outlet_type, salesman, brand, sku, qty_carton, price_per_carton_idr, gross_sales_idr, discount_idr, net_sales_idr';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Facts behind one outlet's one-line reason, already formatted. */
export type PeerReason = {
  type: string; // lower case, e.g. "toko kelontong"
  times: number; // how many times the type's median outsells this outlet (0 when not meaningful)
  timesText: string; // the same, formatted with one decimal: "1.5" / "1,5"
  median: string;
  net: string;
  trend: { dir: 'up' | 'down'; pct: string; month: string } | null;
  idleSince: string | null;
};
export type DropReason = {
  type: string;
  last: string;
  lastIdr: string;
  first: string;
  firstIdr: string;
  abovePeers: boolean;
  idleSince: string | null;
};

const en = {
  title: 'Sales Insight',
  langLegend: 'Page language',
  langId: 'Bahasa Indonesia',
  langEn: 'English',
  themeToLight: 'Switch to light theme',
  themeToDark: 'Switch to dark theme',
  loadCsv: 'Load CSV',
  reading: 'Reading…',
  dropHint: 'or drop a CSV on the page',
  sourceDemo: 'Demo data (synthetic)',
  sourceUploaded: 'Uploaded',
  sourceNone: 'No data loaded',
  invoiceLines: (n: string) => `${n} invoice lines`,
  backToDefault: 'Back to default data',
  loading: 'Loading data…',

  couldNotLoad: 'Could not load',
  stillShowing: 'The page still shows the data loaded before.',
  dismiss: 'Dismiss',
  workbook:
    'This is a spreadsheet workbook, not a CSV. In Excel use File > Save As > CSV (comma delimited), then load that file.',
  tooLarge: (mb: number) => `The file is ${mb} MB; the limit is 50 MB.`,
  emptyFile: 'The file is empty: no header row and no data.',
  missingColumns: (missing: string[]) =>
    `Missing ${plural(missing.length, 'column', 'columns')}: ${missing.join(', ')}. The first row must name these columns: ${COLUMNS}.`,
  problem: (p: RowProblem): string => {
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
  },
  invalidTitle: (n: string, count: number, file: string) =>
    `${n} ${plural(count, 'row', 'rows')} in ${file} could not be used`,
  invalidText: 'They are left out of every figure. Each one is listed with its line number and the reason.',
  showRows: 'Show rows',
  noSales: 'No sales to show',
  noSalesFile: 'None of the rows in this file could be used. The reasons are listed under Data quality below.',
  noSalesNone: `Load a CSV export with the columns ${COLUMNS}.`,
  dropTitle: 'Drop the CSV to replace the data',
  dropText: 'Same columns as the sales export. Nothing is uploaded: the file is read in this browser.',

  headlineAria: 'Headline figures',
  netSales: 'Net sales',
  heroNote: (full: string, discounts: string | null, returns: string | null) => {
    const parts = [discounts ? `${discounts} discounts` : '', returns ? `${returns} returns` : ''].filter(Boolean);
    return parts.length ? `${full} after ${parts.join(' and ')}` : full;
  },
  change: 'Change',
  changeVs: (vs: string) => `Change, ${vs}`,
  vs: (last: string, first: string) => `${last} vs ${first}`,
  monthPair: (firstIdr: string, first: string, lastIdr: string, last: string) =>
    `${firstIdr} in ${first}, ${lastIdr} in ${last}`,
  needsTwoMonths: 'Needs two months of data',
  activeOutlets: 'Active outlets',
  withInvoice: 'With at least one invoice',
  invoices: 'Invoices',
  cartons: (n: string) => `${n} cartons`,

  viewChart: 'Chart',
  viewTable: 'Table',
  legend: 'Legend',
  regionTitle: 'Sales by region',
  regionShowAs: 'Show regions as',
  regionLede: (first: string, last: string) =>
    `Net sales in ${first} and ${last}, largest region first, with the change and the branch that moved it most.`,
  regionLedeOne: 'Net sales by region, largest first.',
  colRegion: 'Region',
  colNetRp: 'Net sales (Rp)',
  colRegionAside: (vs: string) => `${vs} · biggest branch move`,
  biggestMove: 'Biggest branch move',
  regionTableAria: 'Sales by region, table',
  total: 'Total',
  share: 'Share',
  brandTitle: 'Sales by brand',
  brandShowAs: 'Show brands as',
  brandLede: "Net sales over the whole period, with each brand's share of the total and its change.",
  colBrand: 'Brand',
  colBrandAside: (vs: string) => `Share · ${vs}`,
  ofNetSales: (share: string) => `${share} of net sales`,
  brandTableAria: 'Sales by brand, table',

  outletsTitle: 'Weakest outlets',
  rankBy: 'Rank outlets by',
  modePeers: 'Weakest vs peers',
  modeDrops: 'Biggest drops',
  ledePeers:
    'Lowest sales against the median outlet of the same type, so a warung is compared with warungs and a grosir with grosirs.',
  ledeDrops: (first: string, last: string) =>
    `Largest fall from ${first} to ${last}, among outlets that bought in ${first}.`,
  colOutlet: 'Outlet',
  colNet: 'Net sales',
  colPeer: 'Of type median',
  cellPeer: (median: string) => `Of type median, ${median}`,
  colLastOrder: 'Last order',
  salesman: (name: string) => `Salesman ${name}`,
  listPeers: 'Weakest outlets against peers',
  listDrops: 'Biggest drops',
  noOutlets: 'No outlets in this file.',
  dropsNeedTwo: 'Drops need two months of data; this file covers one.',
  reasonPeers: (r: PeerReason) => {
    let s =
      r.times >= 2
        ? `A typical ${r.type} bought ${r.timesText} times as much (${r.median})`
        : `A typical ${r.type} bought ${r.median}, this outlet ${r.net}`;
    if (r.trend?.dir === 'down') s += `; this outlet is also down ${r.trend.pct} in ${r.trend.month}`;
    if (r.trend?.dir === 'up') s += `; this outlet is up ${r.trend.pct} in ${r.trend.month}, but from a small base`;
    if (r.idleSince) s += `; no order since ${r.idleSince}`;
    return `${s}.`;
  },
  reasonDrops: (r: DropReason) =>
    `${r.last} ${r.lastIdr} against ${r.firstIdr} in ${r.first}, ` +
    (r.abovePeers
      ? `still above a typical ${r.type} over the period`
      : `and below a typical ${r.type} over the period too`) +
    (r.idleSince ? `; no order since ${r.idleSince}` : '') +
    '.',

  tgTitle: 'Telegram summary',
  tgLede:
    'One paragraph for the sales team group: plain text, no formatting symbols, so it pastes exactly as shown.',
  chars: (n: string) => `${n} characters`,
  overLimit: (limit: string) => ` · the summary is over its ${limit}-character limit`,
  copy: 'Copy text',
  copied: 'Copied',
  copiedSr: 'Summary copied to the clipboard',
  copyFailed: 'Copy blocked by the browser: select the text and copy it by hand.',
  summaryError: 'The summary could not be written',

  dqTitle: 'Data quality',
  dqRows: (read: string, used: string) => `${read} rows read, ${used} used`,
  dqCountDuplicates: 'duplicates removed',
  dqCountRegions: 'region spellings unified',
  dqCountNames: 'names trimmed',
  dqCountReturns: (n: number) => plural(n, 'return deducted', 'returns deducted'),
  dqCountShared: 'shared names',
  dqCountInvalid: 'invalid rows',
  dqCountBlankSalesman: 'lines without salesman',
  rows: (n: number) => plural(n, 'row', 'rows'),
  outletsUnit: (n: number) => plural(n, 'outlet', 'outlets'),
  became: 'became',
  noneInFile: 'None in this file.',
  dupTitle: 'Duplicates removed',
  dupWhy: 'Lines identical in every column to an earlier line. The first copy is kept.',
  regionFixTitle: 'Region spellings unified',
  regionFixWhy: 'The same region typed differently in the export, mapped to one name so it adds up in one row.',
  nameFixTitle: 'Names trimmed',
  nameFixWhy: (rows: string, n: number) =>
    `Extra spaces removed from outlet names (${rows} ${plural(n, 'row', 'rows')}). Blue marks show the spaces.`,
  spaces: (n: number, where: 'leading' | 'trailing') => `${n} ${where} ${plural(n, 'space', 'spaces')}`,
  returnTitle: (n: number) => plural(n, 'Return deducted', 'Returns deducted'),
  returnWhy: (amount: string, n: number) =>
    `Kept as negative sales: net sales are ${amount} lower because of ${plural(n, 'it', 'them')}.`,
  returnWhyNone: 'Return lines (invoice RTR… or a negative quantity) are kept as negative sales.',
  sharedTitle: 'Shared names',
  sharedWhy:
    'Different outlets with the same name. They stay separate, grouped by outlet ID, and the page shows the ID beside the name.',
  invalidBlockTitle: 'Invalid rows',
  invalidWhy:
    'Rows skipped because a field was missing, a number did not parse or a date was wrong. Line numbers count the header as line 1.',
  blankSalesmanTitle: 'Lines without a salesman',
  blankSalesmanWhy:
    'Kept and counted, but no salesman owns them. The outlet list shows a dash; fill the name in the source export.',
  line: (n: string) => `Line ${n}`,
  andMore: (n: string) => `and ${n} more`,
};

export type Strings = typeof en;

const id: Strings = {
  title: 'Sales Insight',
  langLegend: 'Bahasa halaman',
  langId: 'Bahasa Indonesia',
  langEn: 'English',
  themeToLight: 'Ganti ke tema terang',
  themeToDark: 'Ganti ke tema gelap',
  loadCsv: 'Muat CSV',
  reading: 'Membaca…',
  dropHint: 'atau seret CSV ke halaman ini',
  sourceDemo: 'Data demo (sintetis)',
  sourceUploaded: 'Diunggah',
  sourceNone: 'Belum ada data',
  invoiceLines: (n) => `${n} baris faktur`,
  backToDefault: 'Kembali ke data bawaan',
  loading: 'Memuat data…',

  couldNotLoad: 'Gagal memuat',
  stillShowing: 'Halaman masih menampilkan data sebelumnya.',
  dismiss: 'Tutup',
  workbook:
    'Ini file workbook spreadsheet, bukan CSV. Di Excel pilih File > Save As > CSV (comma delimited), lalu muat file tersebut.',
  tooLarge: (mb) => `Ukuran file ${mb} MB; batasnya 50 MB.`,
  emptyFile: 'File kosong: tidak ada baris header maupun data.',
  missingColumns: (missing) =>
    `Kolom tidak ada: ${missing.join(', ')}. Baris pertama harus memuat kolom berikut: ${COLUMNS}.`,
  problem: (p) => {
    switch (p.code) {
      case 'empty':
        return `${p.column} kosong`;
      case 'badDate':
        return `tanggal "${p.value}" bukan format YYYY-MM-DD`;
      case 'notWhole':
        return `${p.column} "${p.value}" bukan ${p.column === 'qty_carton' ? 'jumlah karton bulat' : 'angka rupiah bulat'}`;
      case 'fieldCount':
        return `berisi ${p.got} kolom, header berisi ${p.want}${p.got > p.want ? ' (ada koma tanpa tanda kutip?)' : ''}`;
    }
  },
  invalidTitle: (n, _count, file) => `${n} baris di ${file} tidak bisa dipakai`,
  invalidText: 'Baris itu tidak masuk ke angka mana pun. Masing-masing tercantum dengan nomor baris dan alasannya.',
  showRows: 'Lihat baris',
  noSales: 'Belum ada penjualan untuk ditampilkan',
  noSalesFile: 'Tidak ada baris di file ini yang bisa dipakai. Alasannya tercantum di Kualitas data di bawah.',
  noSalesNone: `Muat ekspor CSV dengan kolom ${COLUMNS}.`,
  dropTitle: 'Lepas CSV untuk mengganti data',
  dropText: 'Kolomnya sama dengan ekspor penjualan. Tidak ada yang diunggah: file dibaca di browser ini.',

  headlineAria: 'Angka utama',
  netSales: 'Penjualan bersih',
  heroNote: (full, discounts, returns) => {
    const parts = [discounts ? `diskon ${discounts}` : '', returns ? `retur ${returns}` : ''].filter(Boolean);
    return parts.length ? `${full} setelah ${parts.join(' dan ')}` : full;
  },
  change: 'Perubahan',
  changeVs: (vs) => `Perubahan, ${vs}`,
  vs: (last, first) => `${last} vs ${first}`,
  monthPair: (firstIdr, first, lastIdr, last) => `${first} ${firstIdr}, ${last} ${lastIdr}`,
  needsTwoMonths: 'Perlu data dua bulan',
  activeOutlets: 'Outlet aktif',
  withInvoice: 'Minimal satu faktur',
  invoices: 'Faktur',
  cartons: (n) => `${n} karton`,

  viewChart: 'Grafik',
  viewTable: 'Tabel',
  legend: 'Legenda',
  regionTitle: 'Penjualan per wilayah',
  regionShowAs: 'Tampilkan wilayah sebagai',
  regionLede: (first, last) =>
    `Penjualan bersih ${first} dan ${last}, wilayah terbesar di atas, dengan perubahannya dan cabang yang paling menggerakkannya.`,
  regionLedeOne: 'Penjualan bersih per wilayah, terbesar di atas.',
  colRegion: 'Wilayah',
  colNetRp: 'Penjualan bersih (Rp)',
  colRegionAside: (vs) => `${vs} · cabang paling bergerak`,
  biggestMove: 'Cabang paling bergerak',
  regionTableAria: 'Penjualan per wilayah, tabel',
  total: 'Total',
  share: 'Pangsa',
  brandTitle: 'Penjualan per merek',
  brandShowAs: 'Tampilkan merek sebagai',
  brandLede: 'Penjualan bersih selama periode, dengan pangsa tiap merek dari total dan perubahannya.',
  colBrand: 'Merek',
  colBrandAside: (vs) => `Pangsa · ${vs}`,
  ofNetSales: (share) => `${share} dari penjualan bersih`,
  brandTableAria: 'Penjualan per merek, tabel',

  outletsTitle: 'Outlet terlemah',
  rankBy: 'Urutkan outlet menurut',
  modePeers: 'Terlemah vs sejenis',
  modeDrops: 'Penurunan terbesar',
  ledePeers:
    'Penjualan terendah dibanding median outlet sejenis: warung dibandingkan dengan warung, grosir dengan grosir.',
  ledeDrops: (first, last) =>
    `Penurunan terbesar dari ${first} ke ${last}, di antara outlet yang membeli pada ${first}.`,
  colOutlet: 'Outlet',
  colNet: 'Penjualan bersih',
  colPeer: 'Dari median tipe',
  cellPeer: (median) => `Dari median tipe, ${median}`,
  colLastOrder: 'Order terakhir',
  salesman: (name) => `Salesman ${name}`,
  listPeers: 'Outlet terlemah dibanding sejenis',
  listDrops: 'Penurunan terbesar',
  noOutlets: 'Tidak ada outlet di file ini.',
  dropsNeedTwo: 'Penurunan perlu data dua bulan; file ini hanya satu bulan.',
  reasonPeers: (r) => {
    let s =
      r.times >= 2
        ? `${cap(r.type)} pada umumnya membeli ${r.timesText} kali lipat (${r.median})`
        : `${cap(r.type)} pada umumnya membeli ${r.median}, outlet ini ${r.net}`;
    if (r.trend?.dir === 'down') s += `; outlet ini juga turun ${r.trend.pct} di ${r.trend.month}`;
    if (r.trend?.dir === 'up') s += `; outlet ini naik ${r.trend.pct} di ${r.trend.month}, tapi dari angka kecil`;
    if (r.idleSince) s += `; tidak ada order sejak ${r.idleSince}`;
    return `${s}.`;
  },
  reasonDrops: (r) =>
    `${r.last} ${r.lastIdr} dibanding ${r.firstIdr} di ${r.first}, ` +
    (r.abovePeers
      ? `masih di atas ${r.type} pada umumnya selama periode`
      : `dan juga di bawah ${r.type} pada umumnya selama periode`) +
    (r.idleSince ? `; tidak ada order sejak ${r.idleSince}` : '') +
    '.',

  tgTitle: 'Ringkasan Telegram',
  tgLede:
    'Satu paragraf untuk grup tim sales: teks biasa tanpa simbol format, jadi tampil persis seperti di sini.',
  chars: (n) => `${n} karakter`,
  overLimit: (limit) => ` · ringkasan melebihi batas ${limit} karakter`,
  copy: 'Salin teks',
  copied: 'Tersalin',
  copiedSr: 'Ringkasan sudah disalin',
  copyFailed: 'Browser memblokir penyalinan: pilih teksnya lalu salin manual.',
  summaryError: 'Ringkasan gagal dibuat',

  dqTitle: 'Kualitas data',
  dqRows: (read, used) => `${read} baris dibaca, ${used} dipakai`,
  dqCountDuplicates: 'baris ganda dibuang',
  dqCountRegions: 'ejaan wilayah diseragamkan',
  dqCountNames: 'nama dirapikan',
  dqCountReturns: () => 'retur dipotong',
  dqCountShared: 'nama kembar',
  dqCountInvalid: 'baris tidak valid',
  dqCountBlankSalesman: 'baris tanpa salesman',
  rows: () => 'baris',
  outletsUnit: () => 'outlet',
  became: 'menjadi',
  noneInFile: 'Tidak ada di file ini.',
  dupTitle: 'Baris ganda dibuang',
  dupWhy: 'Baris yang sama persis di semua kolom dengan baris sebelumnya. Salinan pertama yang dipakai.',
  regionFixTitle: 'Ejaan wilayah diseragamkan',
  regionFixWhy: 'Wilayah yang sama ditulis berbeda di ekspor, disatukan ke satu nama agar terjumlah di satu baris.',
  nameFixTitle: 'Nama dirapikan',
  nameFixWhy: (rows) => `Spasi berlebih dihapus dari nama outlet (${rows} baris). Tanda biru menunjukkan spasinya.`,
  spaces: (n, where) => `${n} spasi di ${where === 'leading' ? 'awal' : 'akhir'}`,
  returnTitle: () => 'Retur dipotong',
  returnWhy: (amount) => `Dicatat sebagai penjualan negatif: penjualan bersih jadi ${amount} lebih rendah.`,
  returnWhyNone: 'Baris retur (faktur RTR… atau jumlah negatif) dicatat sebagai penjualan negatif.',
  sharedTitle: 'Nama kembar',
  sharedWhy:
    'Outlet berbeda dengan nama yang sama. Tetap dihitung terpisah per ID outlet, dan halaman ini menampilkan ID di samping nama.',
  invalidBlockTitle: 'Baris tidak valid',
  invalidWhy:
    'Baris dilewati karena ada kolom kosong, angka tidak terbaca, atau tanggal salah. Nomor baris menghitung header sebagai baris 1.',
  blankSalesmanTitle: 'Baris tanpa salesman',
  blankSalesmanWhy:
    'Tetap dihitung, tapi tidak ada salesman pemiliknya. Daftar outlet menampilkan tanda strip; lengkapi namanya di ekspor sumber.',
  line: (n) => `Baris ${n}`,
  andMore: (n) => `dan ${n} lainnya`,
};

export const STRINGS: Record<Lang, Strings> = { en, id };
