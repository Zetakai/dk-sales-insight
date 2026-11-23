import type { ReactNode } from 'react';
import type { CleaningReport } from '../lib';
import { ChevronIcon } from './icons';
import { useLocale } from './locale';

type Props = {
  cleaning: CleaningReport;
  open: boolean;
  onToggle: (open: boolean) => void;
};

const MAX_INVALID = 50;

/** Shows the spaces a name carried, so "Grosir Sentosa Bintang " is visibly different from "Grosir Sentosa Bintang". */
function Spaced({ text }: { text: string }) {
  const { t } = useLocale();
  const m = /^(\s*)(.*?)(\s*)$/.exec(text);
  const [lead, core, trail] = m ? [m[1], m[2], m[3]] : ['', text, ''];
  const mark = (s: string, where: 'leading' | 'trailing') =>
    s ? (
      <span className="ws" title={t.spaces(s.length, where)}>
        <span className="sr-only">({t.spaces(s.length, where)})</span>
        {[...s].map((_, i) => (
          <span key={i} className="ws__dot" aria-hidden="true" />
        ))}
      </span>
    ) : null;
  return (
    <span>
      {mark(lead, 'leading')}
      {core}
      {mark(trail, 'trailing')}
    </span>
  );
}

/** What cleaning changed, in the order a manager would ask about it. Collapsed by default. */
export function DataQuality({ cleaning: c, open, onToggle }: Props) {
  const { t, f } = useLocale();
  const regionRows = c.regionFixes.reduce((n, x) => n + x.rows, 0);
  const nameRows = c.nameFixes.reduce((n, x) => n + x.rows, 0);
  const returnsIdr = c.returns.reduce((n, r) => n + r.netIdr, 0);
  const rowsNote = (n: number) => `· ${f.count(n)} ${t.rows(n)}`;

  const counts: [string, number][] = [
    [t.dqCountDuplicates, c.duplicates.length],
    [t.dqCountRegions, regionRows],
    [t.dqCountNames, c.nameFixes.length],
    [t.dqCountReturns(c.returns.length), c.returns.length],
    [t.dqCountShared, c.sharedNames.length],
    [t.dqCountInvalid, c.invalid.length],
    [t.dqCountBlankSalesman, c.blankSalesman.length],
  ];

  return (
    <details className="sheet dq" id="data-quality" open={open} onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary className="dq__summary">
        <span className="dq__chevron">
          <ChevronIcon />
        </span>
        <h2 className="sheet__title dq__h">{t.dqTitle}</h2>
        <span className="dq__rows">{t.dqRows(f.count(c.rowsRead), f.count(c.rowsKept))}</span>
        <span className="dq__counts">
          {counts.map(([label, n]) => (
            <span key={label} className={n ? 'dq__count' : 'dq__count dq__count--zero'}>
              <span className="num">{f.count(n)}</span> {label}
            </span>
          ))}
        </span>
      </summary>

      <div className="dq__body">
        <Block title={t.dupTitle} n={c.duplicates.length} why={t.dupWhy}>
          <ul className="dq__list">
            {c.duplicates.map((d, i) => (
              <li key={`${d.invoiceNo}-${i}`}>
                <span className="code">{d.invoiceNo}</span> <span className="muted">{d.sku}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title={t.regionFixTitle} n={regionRows} unit={t.rows(regionRows)} why={t.regionFixWhy}>
          <ul className="dq__list">
            {c.regionFixes.map((x) => (
              <li key={x.from}>
                <span className="code">{x.from}</span> <span className="muted">{t.became}</span> {x.to}{' '}
                <span className="muted num">{rowsNote(x.rows)}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title={t.nameFixTitle}
          n={c.nameFixes.length}
          unit={t.outletsUnit(c.nameFixes.length)}
          why={t.nameFixWhy(f.count(nameRows), nameRows)}
        >
          <ul className="dq__list">
            {c.nameFixes.map((x, i) => (
              <li key={`${x.outletId}-${i}`}>
                <Spaced text={x.from} /> <span className="code muted">{x.outletId}</span>{' '}
                <span className="muted num">{rowsNote(x.rows)}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title={t.returnTitle(c.returns.length)}
          n={c.returns.length}
          why={c.returns.length ? t.returnWhy(f.idrFull(-returnsIdr), c.returns.length) : t.returnWhyNone}
        >
          <ul className="dq__list">
            {c.returns.map((r, i) => (
              <li key={`${r.invoiceNo}-${r.outletId}-${i}`}>
                <span className="code">{r.invoiceNo}</span> {r.outletName}{' '}
                <span className="code muted">{r.outletId}</span>
                <span className="muted num">
                  {' '}
                  · {f.day(r.date)} · {f.idrFull(r.netIdr)}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title={t.sharedTitle} n={c.sharedNames.length} why={t.sharedWhy}>
          <ul className="dq__list">
            {c.sharedNames.map((s) => (
              <li key={s.name}>
                {s.name} <span className="code muted">{s.outletIds.join(', ')}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title={t.invalidBlockTitle} n={c.invalid.length} why={t.invalidWhy}>
          <ul className="dq__list">
            {c.invalid.slice(0, MAX_INVALID).map((r) => (
              <li key={r.line}>
                <span className="code">{t.line(f.count(r.line))}</span> <span className="muted">{r.problems.map(t.problem).join('; ')}</span>
              </li>
            ))}
            {c.invalid.length > MAX_INVALID ? (
              <li className="muted">{t.andMore(f.count(c.invalid.length - MAX_INVALID))}</li>
            ) : null}
          </ul>
        </Block>

        <Block
          title={t.blankSalesmanTitle}
          n={c.blankSalesman.length}
          unit={t.rows(c.blankSalesman.length)}
          why={t.blankSalesmanWhy}
        >
          <ul className="dq__list">
            {c.blankSalesman.slice(0, MAX_INVALID).map((r) => (
              <li key={r.line}>
                <span className="code">{t.line(f.count(r.line))}</span>{' '}
                <span className="code muted">{r.invoiceNo}</span> <span className="code muted">{r.outletId}</span>
              </li>
            ))}
            {c.blankSalesman.length > MAX_INVALID ? (
              <li className="muted">{t.andMore(f.count(c.blankSalesman.length - MAX_INVALID))}</li>
            ) : null}
          </ul>
        </Block>
      </div>
    </details>
  );
}

function Block({
  title,
  n,
  unit,
  why,
  children,
}: {
  title: string;
  n: number;
  unit?: string;
  why: string;
  children: ReactNode;
}) {
  const { t, f } = useLocale();
  return (
    <section className="dq__block">
      <h3 className="dq__title">
        {title}{' '}
        <span className="dq__n num">
          {f.count(n)}
          {unit ? ` ${unit}` : ''}
        </span>
      </h3>
      <p className="dq__why">{why}</p>
      {n > 0 ? children : <p className="dq__none">{t.noneInFile}</p>}
    </section>
  );
}
