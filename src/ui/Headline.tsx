import type { Insights } from '../lib';
import { useLocale } from './locale';
import { changeLabel, monthsOf } from './text';

/** The one hero number (net sales) and three figures a step down. */
export function Headline({ insights }: { insights: Insights }) {
  const { t, f } = useLocale();
  const { totals } = insights;
  const { first, last, two } = monthsOf(insights);
  const hero = f.idr(totals.netIdr);
  // Set the currency smaller than the figure: "Rp" + "813M" (en) / "Rp" + "813 jt" (id).
  const [, sign = '', amount = hero] = /^(−?)Rp(.*)$/.exec(hero) ?? [];

  return (
    <section className="headline" aria-label={t.headlineAria}>
      <div className="hero">
        <p className="figure__label">{insights.scope.region ? t.netSalesIn(insights.scope.region) : t.netSales}</p>
        <p className="hero__value">
          {sign}
          <span className="hero__unit">Rp</span>
          {amount}
        </p>
        <p className="hero__note">
          {t.heroNote(
            f.idrFull(totals.netIdr),
            totals.discountIdr > 0 ? f.idr(totals.discountIdr) : null,
            totals.returnsIdr < 0 ? f.idr(-totals.returnsIdr) : null,
          )}
        </p>
      </div>

      <dl className="stats">
        <div className="stat">
          <dt className="figure__label">{two ? t.changeVs(changeLabel(insights, f, t)) : t.change}</dt>
          <dd className="stat__value">{two ? f.pct(totals.changePct) : '–'}</dd>
          <dd className="stat__note">
            {two
              ? t.monthPair(
                  f.idr(totals.byMonth[first] ?? 0),
                  f.monthShort(first),
                  f.idr(totals.byMonth[last] ?? 0),
                  f.monthShort(last),
                )
              : t.needsTwoMonths}
          </dd>
        </div>
        <div className="stat">
          <dt className="figure__label">{t.activeOutlets}</dt>
          <dd className="stat__value">{f.count(totals.outlets)}</dd>
          <dd className="stat__note">{t.withInvoice}</dd>
        </div>
        <div className="stat">
          <dt className="figure__label">{t.invoices}</dt>
          <dd className="stat__value">{f.count(totals.invoices)}</dd>
          <dd className="stat__note">{t.cartons(f.count(totals.cartons))}</dd>
        </div>
      </dl>
    </section>
  );
}
