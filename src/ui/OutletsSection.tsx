import { useState } from 'react';
import type { Insights, OutletScore } from '../lib';
import { useLocale } from './locale';
import { Section } from './Section';
import { SegmentedControl } from './SegmentedControl';
import { changeLabel, monthsOf, orDash, outletReason, type OutletMode } from './text';

/** Severity of an outlet's sales against its type's median: drives the status colour of its meter. */
function level(peerIndex: number): 'critical' | 'serious' | 'ok' {
  if (peerIndex < 0.25) return 'critical';
  if (peerIndex < 0.75) return 'serious';
  return 'ok';
}

export function OutletsSection({ insights }: { insights: Insights }) {
  const { t, f } = useLocale();
  const [mode, setMode] = useState<OutletMode>('peers');
  const { first, last, two } = monthsOf(insights);
  const vs = changeLabel(insights, f, t);
  // A drop needs two months; with one month every outlet would compare its month with itself.
  const list = mode === 'peers' ? insights.weakest : two ? insights.biggestDrops : [];
  const modes: { value: OutletMode; label: string }[] = [
    { value: 'peers', label: t.modePeers },
    { value: 'drops', label: t.modeDrops },
  ];

  const scoped = insights.scope.region;
  const lede =
    (mode === 'peers' ? t.ledePeers : two ? t.ledeDrops(f.monthShort(first), f.monthShort(last)) : t.needsTwoMonths) +
    (scoped && mode === 'peers' ? ` ${t.peersScoped(scoped)}` : '');

  return (
    <Section
      className="sheet--outlets"
      title={t.outletsTitle}
      lede={lede}
      tools={<SegmentedControl legend={t.rankBy} options={modes} value={mode} onChange={setMode} />}
    >
      {list.length === 0 ? (
        <p className="empty">{mode === 'drops' && !two ? t.dropsNeedTwo : t.noOutlets}</p>
      ) : (
        <div className={`outlets outlets--${mode}`}>
          <div className="outlet outlet--head" aria-hidden="true">
            <span className="outlet__rank">#</span>
            <span className="outlet__who">{t.colOutlet}</span>
            <span className="outlet__net">{t.colNet}</span>
            <span className="outlet__peer">{t.colPeer}</span>
            <span className="outlet__change">{vs}</span>
            <span className="outlet__last">{t.colLastOrder}</span>
          </div>
          <ol className="outlets__list" aria-label={mode === 'peers' ? t.listPeers : t.listDrops}>
            {list.map((o, i) => (
              <OutletRow key={o.outletId} o={o} rank={i + 1} mode={mode} insights={insights} vs={vs} two={two} />
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}

type RowProps = { o: OutletScore; rank: number; mode: OutletMode; insights: Insights; vs: string; two: boolean };

function OutletRow({ o, rank, mode, insights, vs, two }: RowProps) {
  const { t, f } = useLocale();
  const fill = Math.min(1, Math.max(0, o.peerIndex));
  return (
    <li className="outlet">
      <span className="outlet__rank num" aria-hidden="true">
        {rank}
      </span>
      <div className="outlet__who">
        <p className="outlet__name">
          {o.outletName} <span className="code">{o.outletId}</span>
        </p>
        <p className="outlet__meta">
          {o.outletType} · {o.branch}, {o.region} · {t.salesman(orDash(o.salesman))}
        </p>
      </div>
      <p className="outlet__net">
        <span className="cell-label">{t.colNet}</span>
        <span className="num">{f.idr(o.netIdr)}</span>
      </p>
      <p className="outlet__peer">
        <span className="cell-label">{t.cellPeer(f.idr(o.peerMedianIdr))}</span>
        <span className="meter" data-level={level(o.peerIndex)} aria-hidden="true">
          <span className="meter__fill" style={{ width: `${fill * 100}%` }} />
        </span>
        <span className="num">{f.ratio(o.peerIndex)}</span>
      </p>
      <p className="outlet__change">
        <span className="cell-label">{vs}</span>
        <span className="num">{two ? f.pct(o.changePct) : '–'}</span>
      </p>
      <p className="outlet__last">
        <span className="cell-label">{t.colLastOrder}</span>
        <span className="num">{o.lastOrder ? f.day(o.lastOrder) : '–'}</span>
      </p>
      <p className="outlet__reason">{outletReason(o, mode, insights, f, t)}</p>
    </li>
  );
}
