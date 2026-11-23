/**
 * The contract between the data layer (src/lib) and the UI (src/ui). Both sides build against these types; neither
 * changes them without the other. All money is integer rupiah (IDR). Months are "YYYY-MM".
 */

/** One CSV row as read, before any cleaning. Column names exactly as in data/sales.csv. */
export type RawRow = {
  date: string;
  invoice_no: string;
  region: string;
  branch: string;
  outlet_id: string;
  outlet_name: string;
  outlet_type: string;
  salesman: string;
  brand: string;
  sku: string;
  qty_carton: string;
  price_per_carton_idr: string;
  gross_sales_idr: string;
  discount_idr: string;
  net_sales_idr: string;
};

/** One cleaned invoice line. A return (invoice prefix RTR, or negative quantity) keeps its negative amounts. */
export type SaleLine = {
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  invoiceNo: string;
  isReturn: boolean;
  region: string; // canonical spelling
  branch: string;
  outletId: string;
  outletName: string; // trimmed
  outletType: string;
  salesman: string;
  brand: string;
  sku: string;
  qtyCarton: number;
  pricePerCartonIdr: number;
  grossIdr: number;
  discountIdr: number;
  netIdr: number;
};

/** What cleaning changed, so the UI can show it and the summary can mention it. */
export type CleaningReport = {
  rowsRead: number;
  rowsKept: number;
  /** Exact duplicate lines (every column identical) removed, one entry per removed line. */
  duplicates: { invoiceNo: string; sku: string }[];
  /** Region spellings mapped to the canonical name, e.g. "Jabar" -> "Jawa Barat". */
  regionFixes: { from: string; to: string; rows: number }[];
  /** Outlet names that carried extra spaces, per outlet. */
  nameFixes: { outletId: string; from: string; to: string; rows: number }[];
  /** Return lines kept as negative sales. */
  returns: { invoiceNo: string; outletId: string; outletName: string; date: string; netIdr: number }[];
  /** Different outlet ids sharing one name (they stay separate outlets). */
  sharedNames: { name: string; outletIds: string[] }[];
  /**
   * Rows that could not be used, with the 1-based CSV line. `problems` lets the UI word each one in the page
   * language; `reason` is the same in English (the summary, logs and tests read it).
   */
  invalid: { line: number; reason: string; problems: RowProblem[] }[];
  /** Kept lines with no salesman: their sales count, but no one owns them (1-based CSV line). */
  blankSalesman: { line: number; invoiceNo: string; outletId: string }[];
};

/** Net sales of one dimension value (a region, a brand) over the period. */
export type Breakdown = {
  key: string;
  netIdr: number;
  share: number; // 0..1 of total net
  byMonth: Record<string, number>; // month -> net IDR
  changePct: number | null; // last month vs first month, %; null when the first month is 0
  /** Regions only: the branch that moved the most between the two months, and by how much. */
  driver?: { branch: string; deltaIdr: number; changePct: number | null };
};

/** One outlet, scored against outlets of the same type. */
export type OutletScore = {
  outletId: string;
  outletName: string;
  outletType: string;
  region: string;
  branch: string;
  salesman: string; // the salesman on most of its lines
  netIdr: number;
  invoices: number; // distinct invoice numbers
  firstMonthIdr: number;
  lastMonthIdr: number;
  changePct: number | null;
  lastOrder: string; // YYYY-MM-DD
  /** Net sales divided by the median net sales of its outlet type (1 = typical). */
  peerIndex: number;
  peerMedianIdr: number;
};

export type Insights = {
  period: { from: string; to: string; months: string[] };
  totals: {
    netIdr: number;
    grossIdr: number;
    discountIdr: number;
    returnsIdr: number; // negative or 0
    invoices: number;
    outlets: number;
    cartons: number;
    byMonth: Record<string, number>;
    changePct: number | null;
  };
  byRegion: Breakdown[]; // sorted by netIdr, high to low
  byBrand: Breakdown[]; // sorted by netIdr, high to low
  /** The 5 weakest outlets: lowest peerIndex (sales vs the median of their outlet type), weakest first. */
  weakest: OutletScore[];
  /** The 5 biggest drops, last month vs first month (only outlets that sold in the first month), worst first. */
  biggestDrops: OutletScore[];
  outlets: OutletScore[]; // every outlet, weakest peerIndex first
  cleaning: CleaningReport;
};

export type Lang = 'id' | 'en';

/** Why one row was skipped. Every problem of a row is listed, so it can be fixed in one pass. */
export type RowProblem =
  | { code: 'empty'; column: string }
  | { code: 'badDate'; value: string }
  | { code: 'notWhole'; column: string; value: string }
  | { code: 'fieldCount'; got: number; want: number };
