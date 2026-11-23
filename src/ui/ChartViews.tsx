import { useState } from 'react';
import { biggestMover, type Breakdown, type Insights } from '../lib';
import type { Insight } from './i18n';
import { BarChart, Legend, type BarRow, type BarSeries } from './BarChart';
import { useLocale } from './locale';
import { Section } from './Section';
import { SegmentedControl } from './SegmentedControl';
import { changeLabel, monthsOf, type Format } from './text';

type View = 'chart' | 'table';

function useViews() {
  const { t } = useLocale();
  const options: { value: View; label: string }[] = [
    { value: 'chart', label: t.viewChart },
    { value: 'table', label: t.viewTable },
  ];
  return options;
}

/**
 * The takeaway under a chart title: the largest row, and the row that moved most in rupiah (the same rule the Telegram
 * summary uses, so both name the same region and brand). A region's driver branch is named only when it moved the
 * same way as its region.
 */
function insightOf(rows: Breakdown[], i: Insights, f: Format): Insight | null {
  const top = rows[0];
  if (!top) return null;
  const { first, last, two } = monthsOf(i);
  const m = two ? biggestMover(rows, first, last) : undefined;
  if (!m) return { top: top.key, share: f.ratio(top.share) };
  const delta = (m.byMonth[last] ?? 0) - (m.byMonth[first] ?? 0);
  const d = m.driver;
  const driver = d && d.deltaIdr !== 0 && Math.sign(d.deltaIdr) === Math.sign(delta) ? d.branch : undefined;
  return {
    top: top.key,
    share: f.ratio(top.share),
    mover: { name: m.key, change: m.changePct !== null ? f.pct(m.changePct) : f.signedIdr(delta), driver },
  };
}

/** First and last month as an ordered pair of one hue; a one-month file gets a single series. */
function monthSeries(i: Insights, f: Format): BarSeries[] {
  const { first, last, two } = monthsOf(i);
  if (!last) return [];
  return two
    ? [
        { id: first, label: f.monthLong(first), color: '--bar-first' },
        { id: last, label: f.monthLong(last), color: '--bar-last' },
      ]
    : [{ id: last, label: f.monthLong(last), color: '--bar-last' }];
}

/* ---------------------------------------------------------------------------------------------------------- */

export function RegionSection({ insights }: { insights: Insights }) {
  const { t, f } = useLocale();
  const views = useViews();
  const [view, setView] = useState<View>('chart');
  const series = monthSeries(insights, f);
  const { first, last, two } = monthsOf(insights);
  const vs = changeLabel(insights, f, t);
  // One region picked: the same chart, by branch (a branch has no driver of its own).
  const scoped = insights.scope.region;
  const areas = scoped ? insights.byBranch : insights.byRegion;
  const areaInsight = insightOf(areas, insights, f);

  const rows: BarRow[] = areas.map((r) => {
    const values = series.map((s) => r.byMonth[s.id] ?? 0);
    const d = r.driver;
    return {
      key: r.key,
      name: r.key,
      values,
      change: two ? <span className="num">{f.pct(r.changePct)}</span> : null,
      note:
        two && d && d.deltaIdr !== 0 ? (
          <>
            <span className="only-narrow">{t.biggestMove}: </span>
            {d.branch} <span className="num">{f.signedIdr(d.deltaIdr)}</span>
          </>
        ) : null,
      description:
        `${r.key}: ` +
        series.map((s, i) => `${s.label} ${f.idr(values[i])}`).join(', ') +
        (two ? `, ${f.pct(r.changePct)} ${vs}` : '') +
        (two && d ? `; ${t.biggestMove} ${d.branch} ${f.signedIdr(d.deltaIdr)}` : ''),
      tipNote: two ? `${f.pct(r.changePct)} ${vs}${d ? ` · ${d.branch} ${f.pct(d.changePct)}` : ''}` : undefined,
    };
  });

  return (
    <Section
      className="sheet--region"
      title={scoped ? t.branchTitle(scoped) : t.regionTitle}
      lede={areaInsight ? (scoped ? t.branchInsight(areaInsight) : t.regionInsight(areaInsight)) : undefined}
      extra={view === 'chart' ? <Legend series={series} /> : null}
      tools={<SegmentedControl legend={t.regionShowAs} options={views} value={view} onChange={setView} />}
    >
      {view === 'chart' ? (
        <BarChart
          series={series}
          rows={rows}
          labelSeries={series.length - 1}
          columns={[scoped ? t.colBranch : t.colRegion, t.colNetRp, two ? (scoped ? vs : t.colRegionAside(vs)) : '']}
        />
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label={t.regionTableAria}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{scoped ? t.colBranch : t.colRegion}</th>
                {two ? (
                  <th scope="col" className="num">
                    {f.monthLong(first)}
                  </th>
                ) : null}
                <th scope="col" className="num">
                  {f.monthLong(last)}
                </th>
                <th scope="col" className="num">
                  {t.total}
                </th>
                <th scope="col" className="num">
                  {t.share}
                </th>
                {two ? (
                  <th scope="col" className="num">
                    {vs}
                  </th>
                ) : null}
                {two && !scoped ? <th scope="col">{t.biggestMove}</th> : null}
              </tr>
            </thead>
            <tbody>
              {areas.map((r) => (
                <tr key={r.key}>
                  <th scope="row">{r.key}</th>
                  {two ? <td className="num">{f.idrFull(r.byMonth[first] ?? 0)}</td> : null}
                  <td className="num">{f.idrFull(r.byMonth[last] ?? 0)}</td>
                  <td className="num">{f.idrFull(r.netIdr)}</td>
                  <td className="num">{f.ratio(r.share)}</td>
                  {two ? <td className="num">{f.pct(r.changePct)}</td> : null}
                  {two && !scoped ? (
                    <td>
                      {r.driver ? (
                        <>
                          {r.driver.branch}{' '}
                          <span className="num muted">
                            {f.signedIdr(r.driver.deltaIdr)} ({f.pct(r.driver.changePct)})
                          </span>
                        </>
                      ) : (
                        '–'
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

/* ---------------------------------------------------------------------------------------------------------- */

export function BrandSection({ insights }: { insights: Insights }) {
  const { t, f } = useLocale();
  const views = useViews();
  const [view, setView] = useState<View>('chart');
  const { first, last, two } = monthsOf(insights);
  const vs = changeLabel(insights, f, t);
  const series: BarSeries[] = [{ id: 'net', label: t.netSales, color: '--bar-last' }];
  const brandInsight = insightOf(insights.byBrand, insights, f);

  const rows: BarRow[] = insights.byBrand.map((b) => ({
    key: b.key,
    name: b.key,
    values: [b.netIdr],
    change: <span className="num">{f.ratio(b.share)}</span>,
    note: two ? (
      <>
        <span className="num">{f.pct(b.changePct)}</span> {vs}
      </>
    ) : null,
    description: `${b.key}: ${f.idr(b.netIdr)}, ${t.ofNetSales(f.ratio(b.share))}${two ? `, ${f.pct(b.changePct)} ${vs}` : ''}`,
    tipNote: two
      ? `${f.monthShort(first)} ${f.idr(b.byMonth[first] ?? 0)} · ${f.monthShort(last)} ${f.idr(b.byMonth[last] ?? 0)}`
      : t.ofNetSales(f.ratio(b.share)),
  }));

  return (
    <Section
      className="sheet--brand"
      title={t.brandTitle}
      lede={brandInsight ? t.brandInsight(brandInsight) : undefined}
      tools={<SegmentedControl legend={t.brandShowAs} options={views} value={view} onChange={setView} />}
    >
      {view === 'chart' ? (
        <BarChart
          series={series}
          rows={rows}
          labelSeries={0}
          barHeight={12}
          columns={[t.colBrand, t.colNetRp, two ? t.colBrandAside(vs) : t.share]}
        />
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label={t.brandTableAria}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{t.colBrand}</th>
                {two ? (
                  <th scope="col" className="num">
                    {f.monthLong(first)}
                  </th>
                ) : null}
                <th scope="col" className="num">
                  {f.monthLong(last)}
                </th>
                <th scope="col" className="num">
                  {t.total}
                </th>
                <th scope="col" className="num">
                  {t.share}
                </th>
                {two ? (
                  <th scope="col" className="num">
                    {vs}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {insights.byBrand.map((b) => (
                <tr key={b.key}>
                  <th scope="row">{b.key}</th>
                  {two ? <td className="num">{f.idrFull(b.byMonth[first] ?? 0)}</td> : null}
                  <td className="num">{f.idrFull(b.byMonth[last] ?? 0)}</td>
                  <td className="num">{f.idrFull(b.netIdr)}</td>
                  <td className="num">{f.ratio(b.share)}</td>
                  {two ? <td className="num">{f.pct(b.changePct)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
