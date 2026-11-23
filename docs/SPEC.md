# Sales Insight: spec

The build test (Dua Kelinci, AI Builder): "ship a small web app that shows sales by region and brand, flags the 5
weakest outlets, and writes a one-paragraph summary a sales manager could read in Telegram." They run it on their own
machine from the repo and a short README.

Data: `data/sales.csv` is the sample export from the brief, and the page opens on it. `data/demo.csv` holds
synthetic outlets and figures with the same columns and the same kinds of problems, written by
`scripts/make-demo.mjs`; the page falls back to it when `sales.csv` is absent, and the tests use both.

Contract: `src/lib/types.ts` (types) and `src/lib/index.ts` (public functions). Reference result for the demo:
`src/lib/fixture.ts` (`FIXTURE`), and for the sample `src/lib/fixture-sales.ts`, both written by
`scripts/reference_insights.py`, an independent Python implementation of this spec.

## 1. Data and what is wrong with it (found in the real export, 2026-11-23)

Columns: date, invoice_no, region, branch, outlet_id, outlet_name, outlet_type, salesman, brand, sku, qty_carton,
price_per_carton_idr, gross_sales_idr, discount_idr, net_sales_idr. gross = qty × price and net = gross − discount on
every line (checked).

| Issue | Rule |
|---|---|
| Exact duplicate lines (all 15 columns equal) | Keep the first, drop the rest, report each |
| Region spellings (`Jabar`, `JAWA BARAT`, `JABODETABEK`) | Map case-insensitively to the most common spelling of that name; alias `jabar`→Jawa Barat, `jatim`→Jawa Timur, `jateng`→Jawa Tengah, `dki`→Jabodetabek; an unknown region is title-cased and kept |
| Outlet names with trailing spaces | Trim; report per outlet |
| Return lines (invoice `RTR…`, negative quantity) | `isReturn` when the invoice starts with `RTR` or qty < 0; keep it, negative amounts reduce net sales |
| One name, several outlet ids | Group by `outlet_id`, never by name; show the branch (and the id if needed) beside a shared name |
| A blank salesman | Keep the line (its sales are real); report it in `blankSalesman` |
| Bad rows (missing field, non-numeric amount, bad date) | Skip and report with the 1-based CSV line (header = line 1) and a reason; never crash |

The CSV parser must handle quoted fields (commas or quotes inside quotes), CRLF line ends, a BOM, a trailing newline,
blank lines, a semicolon or tab separator (read from the header line) and header names in any case: a manager may
upload an export from Excel. Cartons and rupiah must be whole numbers (`1.050` is refused, not read as 1.05).

## 2. Metrics (exact definitions; `FIXTURE` follows them)

- Months: the distinct `YYYY-MM` in the data, sorted. "First month" / "last month" = the first and last of them.
- `changePct` = (last / first − 1) × 100, rounded to 1 decimal; `null` when first is 0.
- `share` = netIdr / total net, rounded to 4 decimals.
- Totals: net, gross, discount over all kept lines; `returnsIdr` = sum of net over return lines (≤ 0);
  `invoices` = distinct invoice numbers of non-return lines; `outlets` = distinct outlet ids; `cartons` = sum of qty
  (returns subtract).
- `byRegion` / `byBrand`: net per value, sorted high to low; `byMonth` has every month (0 when none).
- Region `driver`: within the region, the branch whose net changed most in absolute rupiah between first and last
  month (`deltaIdr` = last − first, `changePct` for that branch).
- Outlets: `salesman` = the salesman on most of its lines (ties: first seen); `invoices` = distinct non-return
  invoice numbers; `lastOrder` = latest date; `peerMedianIdr` = median net of all outlets of the same `outletType`
  (even count: mean of the middle two); `peerIndex` = netIdr / peerMedianIdr, rounded to 4 decimals.
- `weakest` = the 5 lowest `peerIndex` (ties: lower netIdr first). Why peers: a warung sells less than a grosir by
  nature, so raw totals would only ever flag small shops; against its own type an outlet is weak for its kind.
  (On this sample both rules pick the same 5.)
- `biggestDrops` = among outlets with firstMonthIdr > 0, the 5 lowest lastMonthIdr / firstMonthIdr.
- `outlets` = every outlet, sorted like `weakest`.

Acceptance: `analyze(demoCsv)` deep-equals `FIXTURE` and `analyze(salesCsv)` deep-equals the sample's fixture (numbers
exactly; ratios as rounded above). Any export in `data/sales.csv` must add up (regions, brands and outlets each sum
to the total).

## 3. Telegram summary

`telegramSummary(insights, lang)`: ONE paragraph, plain text (no Markdown symbols, they show literally in a plain
paste), at most 900 characters, `lang` = `id` (default in the UI) or `en`, numbers through `src/lib/format.ts`.
In this order, each only when it says something:
1. Period and net sales, with the change last month vs first month.
2. The strongest and the weakest region by net, and the biggest mover with its driver branch (e.g. Jawa Tengah
   +57,3%, didorong Semarang +259,8%, in the demo).
3. The top brand and its share, and the brand that moved most.
4. The 5 weakest outlets by name (with branch when a name is shared), and one action ("prioritaskan kunjungan
   minggu ini" / "prioritise visits this week").
5. One short data note when cleaning changed anything (duplicates removed, return deducted, spellings unified).

It must read like a sales manager wrote it: short clauses, no "This summary…".

`telegramSummary(insights, lang, 'lines')` gives the same words laid out for a phone: the headline, then the region
and brand lines, then the outlets as a numbered list with the action under them, then the data note, with a blank
line between blocks. The UI defaults to the paragraph (the brief) and offers the lines layout as a switch.

## 4. UI

A single page, desktop first and clean at 375px wide. Reads `data/sales.csv` on load when present, else
`data/demo.csv`, and says which; a "Load
CSV" button and drag-and-drop replace it with another export (same columns) without a reload; a bad file shows its
invalid rows, never a blank page.

One language switch (Bahasa Indonesia default, English) covers the whole page, remembered per browser; every
string lives in `src/ui/i18n.ts`.

Layout: one column below 1200px; from 1200px a 12-column grid, fluid up to 1920px: headline full width, region | brand
(6 + 6), weakest outlets | Telegram summary (8 + 4), data quality full width. Charts size to their own sheet
(container queries). Each chart's subtitle is its takeaway (largest row, and the one that moved most, by the same
rule as the summary), not a description of the chart.

Sections, in this order:
1. Header: title, the period ("1 Sep – 31 Oct 2026"), the data source (sample or the uploaded file name), Load CSV.
2. Headline figures: net sales (the one hero number), change vs first month, active outlets, invoices.
3. Sales by region: a horizontal bar per region, two bars per row (first month, last month), sorted by total, the
   change and its driver branch as text on the row. A table view of the same numbers.
4. Sales by brand: a horizontal bar per brand (total), share and change as text. A table view.
5. Weakest outlets: the 5 flagged outlets as rows (name, id, type, branch, salesman, net, % of its type's median,
   change, last order) with one plain reason each; a two-option switch "Weakest vs peers / Biggest drops".
6. Telegram summary: the paragraph shown as a Telegram message (the page's signature element), in the page
   language, a Paragraph / Line by line switch, a Copy button that copies the exact text, and the character count.
7. Data quality: what cleaning changed (section 1 table), collapsed by default, with counts in its header.

Design direction (interface-design, dataviz skills):
- Who: a regional or national sales head on a laptop at the Monday review, then a phone. The job: see where sales
  moved, decide which outlets get visits, paste the summary into the team group.
- Feel: calm, exact, a working document; no decoration, no gradients, no emoji, no illustrations.
- One accent colour, used for actions and the focal figure. Surfaces in one hue, light and dark (prefers-color-scheme
  plus a toggle). Borders, not shadows. Numbers in tabular figures, right-aligned in tables.
- Charts hand-drawn in SVG (no chart library): thin bars with 4px rounded ends, a 2px gap between the two bars of a
  row, the first month a light step and the last month a dark step of ONE hue (an ordered pair, not two
  categories), a legend because there are two series, direct value labels only where useful, a hover tooltip per
  bar, recessive axis. Text in text colours, never the series colour.
- No red/green for good/bad without a sign and a word; status colours only for the flagged outlets.
- Accessible: real buttons, visible focus, labels, aria on charts, keyboard-reachable switches.

## 5. Ownership (parallel build)

| Worker | Owns | Verify |
|---|---|---|
| Data | `src/lib/csv.ts`, `src/lib/clean.ts`, `src/lib/metrics.ts`, `src/lib/summary.ts`, `src/lib/*.test.ts` | `npm test` (deep-equal to FIXTURE, edge cases, summary length and content), `npm run typecheck` |
| UI | `src/App.tsx`, `src/main.tsx`, `src/ui/**`, `src/styles/**`, `index.html` | `npm run typecheck`, `npm run build`, the page renders the demo and an uploaded file |

Nobody edits `src/lib/types.ts`, `src/lib/index.ts`, `src/lib/format.ts` or `src/lib/fixture.ts`; a needed change goes
in the worker's report instead. Workers do not commit; the orchestrator merges, reviews and pushes.
