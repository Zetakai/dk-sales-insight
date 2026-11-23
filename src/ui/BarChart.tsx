import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useLocale } from './locale';

/**
 * Hand-drawn horizontal bars (no chart library). Each row is HTML text around one measured SVG track, so names and
 * notes wrap like text and the bars stay crisp at any width. Marks follow the dataviz spec: thin bars, 4px rounded
 * data-end and square baseline, a 2px gap between the two bars of a row, hairline rules, a value at the tip of one
 * series only, and a tooltip per bar on hover and per row on keyboard focus.
 */

export type BarSeries = { id: string; label: string; color: string };

export type BarRow = {
  key: string;
  name: string;
  values: number[];
  /** Right-hand text: the first line (strong) and the second line (muted). */
  change: ReactNode;
  note: ReactNode;
  /** Accessible name of the row's bars: every value in words. */
  description: string;
  /** One extra line in the tooltip. */
  tipNote?: string;
};

type Props = {
  series: BarSeries[];
  rows: BarRow[];
  /** Which series prints its value at the bar tip (the others are in the tooltip and the table). */
  labelSeries: number;
  columns: [string, string, string];
  barHeight?: number;
};

const GAP = 2;
const PAD = 8; // air above and below the bars inside each row's hit area
const RADIUS = 4;
const LABEL_ROOM = 72; // space kept right of the longest bar for its value label

/** Rounded at the data end, square at the baseline. */
function barPath(w: number, y: number, h: number): string {
  if (w <= 0) return '';
  const r = Math.min(RADIUS, h / 2, w);
  return `M0,${y}H${w - r}A${r},${r} 0 0 1 ${w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${w - r},${y + h}H0Z`;
}

/** A clean axis: steps of 1, 2, 2.5 or 5 x 10^k, about four of them. */
function niceScale(max: number): { step: number; top: number } {
  if (!(max > 0)) return { step: 1, top: 1 };
  const raw = max / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  return { step, top: Math.ceil(max / step) * step };
}

/** "100M" on the axis: the compact rupiah from format.ts without the currency prefix (the title names it). */
const tickLabel = (v: number, idr: (n: number) => string) => (v === 0 ? '0' : idr(v).replace('Rp', '').trim());

type Tip = { row: number; series: number | null; x: number; y: number };

/** Position and width of the axis track inside the chart, kept current as the layout changes. */
function useTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const read = () => {
      const left = Math.round(el.getBoundingClientRect().left - root.getBoundingClientRect().left);
      const width = Math.floor(el.clientWidth);
      setBox((b) => (b.left === left && b.width === width ? b : { left, width }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);
  return { ref, rootRef, box };
}

export function BarChart({ series, rows, labelSeries, columns, barHeight = 10 }: Props) {
  const { idr } = useLocale().f;
  const { ref: axisRef, rootRef, box } = useTrack();
  const [tip, setTip] = useState<Tip | null>(null);

  const max = Math.max(0, ...rows.flatMap((r) => r.values));
  const { step, top } = niceScale(max);
  const plotW = Math.max(0, box.width - LABEL_ROOM);
  const x = (v: number) => (Math.max(0, v) / top) * plotW;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);

  const n = series.length;
  const svgH = PAD * 2 + n * barHeight + (n - 1) * GAP;
  const barY = (si: number) => PAD + si * (barHeight + GAP);

  /** Keep the tooltip inside the chart: it is centred on x and about 200px wide. */
  const place = (clientX: number, top: number, root: DOMRect): Pick<Tip, 'x' | 'y'> => {
    const half = Math.min(110, root.width / 2);
    return { x: Math.min(Math.max(clientX - root.left, half), root.width - half), y: top - root.top };
  };

  const onBarPointer = (e: PointerEvent<SVGRectElement>, row: number, s: number) => {
    const root = rootRef.current?.getBoundingClientRect();
    if (!root) return;
    const svgTop = (e.currentTarget.ownerSVGElement ?? e.currentTarget).getBoundingClientRect().top;
    setTip({ row, series: s, ...place(e.clientX, svgTop + barY(s) - 4, root) });
  };

  const onRowFocus = (el: HTMLElement, row: number) => {
    const root = rootRef.current?.getBoundingClientRect();
    if (!root) return;
    const t = el.getBoundingClientRect();
    const end = x(Math.max(...rows[row].values));
    setTip({ row, series: null, ...place(t.left + end, t.top + PAD - 4, root) });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setTip(null);
  };

  const active = tip ? rows[tip.row] : null;

  return (
    <div className="bars" ref={rootRef} onPointerLeave={() => setTip(null)} data-hovering={tip ? '' : undefined}>
      <div className="bars__row bars__row--head" aria-hidden="true">
        <span className="bars__label">{columns[0]}</span>
        <span className="bars__track">{columns[1]}</span>
        <span className="bars__change">{columns[2]}</span>
      </div>

      <div className="bars__plot">
        <svg className="bars__grid" style={{ left: box.left, width: box.width }} aria-hidden="true" focusable="false">
          {ticks.map((t, i) => (
            <line
              key={t}
              className={i === 0 ? 'bars__baseline' : undefined}
              x1={Math.round(x(t)) + 0.5}
              x2={Math.round(x(t)) + 0.5}
              y1="0"
              y2="100%"
            />
          ))}
        </svg>

        {rows.map((r, ri) => (
          <div className="bars__row" key={r.key}>
            <div className="bars__label">{r.name}</div>
            <div
              className="bars__track"
              tabIndex={0}
              role="img"
              aria-label={r.description}
              onFocus={(e) => onRowFocus(e.currentTarget, ri)}
              onBlur={() => setTip(null)}
              onKeyDown={onKey}
            >
              <svg width={box.width} height={svgH} className="bars__svg" aria-hidden="true" focusable="false">
                {series.map((s, si) => {
                  const y = barY(si);
                  const w = x(r.values[si] ?? 0);
                  const lit = !tip || (tip.row === ri && (tip.series === null || tip.series === si));
                  // Hit band: the bar, its half of the gap, and the row's padding on the outer side.
                  const hitTop = si === 0 ? 0 : y - GAP / 2;
                  const hitBottom = si === n - 1 ? svgH : y + barHeight + GAP / 2;
                  return (
                    <g key={s.id} className={lit ? 'bar' : 'bar bar--dim'}>
                      <path d={barPath(w, y, barHeight)} fill={`var(${s.color})`} />
                      {si === labelSeries ? (
                        <text className="bars__value" x={w + 6} y={y + barHeight / 2} dominantBaseline="central">
                          {idr(r.values[si] ?? 0)}
                        </text>
                      ) : null}
                      <rect
                        className="bars__hit"
                        x={0}
                        y={hitTop}
                        width={box.width}
                        height={hitBottom - hitTop}
                        onPointerMove={(e) => onBarPointer(e, ri, si)}
                        onPointerDown={(e) => onBarPointer(e, ri, si)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="bars__change">{r.change}</div>
            <div className="bars__note">{r.note}</div>
          </div>
        ))}
      </div>

      <div className="bars__row bars__row--axis" aria-hidden="true">
        <span className="bars__label" />
        <div className="bars__track" ref={axisRef}>
          <svg width={box.width} height={16} className="bars__svg">
            {ticks.map((t, i) => (
              <text key={t} className="bars__tick" x={x(t)} y={12} textAnchor={i === 0 ? 'start' : 'middle'}>
                {tickLabel(t, idr)}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {tip && active ? (
        <div className="tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          <p className="tip__title">{active.name}</p>
          {series.map((s, si) => (
            <p
              key={s.id}
              className={tip.series === null || tip.series === si ? 'tip__row' : 'tip__row tip__row--quiet'}
            >
              <span className="tip__key" style={{ background: `var(${s.color})` }} />
              <span className="tip__value">{idr(active.values[si] ?? 0)}</span>
              <span className="tip__label">{s.label}</span>
            </p>
          ))}
          {active.tipNote ? <p className="tip__note">{active.tipNote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Legend for two or more series: the swatch mirrors the bar mark (rounded data-end). */
export function Legend({ series }: { series: BarSeries[] }) {
  const { t } = useLocale();
  if (series.length < 2) return null;
  return (
    <ul className="legend" aria-label={t.legend}>
      {series.map((s) => (
        <li key={s.id} className="legend__item">
          <svg width="16" height="10" aria-hidden="true" focusable="false">
            <path d={barPath(16, 0, 10)} fill={`var(${s.color})`} />
          </svg>
          {s.label}
        </li>
      ))}
    </ul>
  );
}
