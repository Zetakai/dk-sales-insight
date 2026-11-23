import { useRef, type ChangeEvent } from 'react';
import type { Insights, Lang } from '../lib';
import { MoonIcon, SunIcon, UploadIcon } from './icons';
import { useLocale } from './locale';
import { SegmentedControl } from './SegmentedControl';
import type { Source } from './useInsights';
import type { Theme } from './useTheme';

type Props = {
  insights: Insights | null;
  source: Source;
  busy: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  onFile: (file: File) => void;
  onDefault: () => void;
};

export function Header({ insights, source, busy, theme, onToggleTheme, onFile, onDefault }: Props) {
  const { t, f, lang, setLang } = useLocale();
  const input = useRef<HTMLInputElement>(null);

  const picked = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // picking the same file again should reload it
    if (file) onFile(file);
  };

  const period = insights ? f.period(insights.period) : '';
  const langs: { value: Lang; label: string; srLabel: string; lang: string }[] = [
    { value: 'id', label: 'ID', srLabel: t.langId, lang: 'id' },
    { value: 'en', label: 'EN', srLabel: t.langEn, lang: 'en' },
  ];

  return (
    <header className="masthead">
      <div className="masthead__id">
        <h1 className="masthead__title">{t.title}</h1>
        <p className="masthead__meta">
          {period ? <span className="masthead__period">{period}</span> : null}
          <span className="masthead__source">
            {source.kind === 'demo' ? <span className="masthead__demo">{t.sourceDemo}</span> : null}
            {source.kind === 'bundled' ? <span className="code">{source.name}</span> : null}
            {source.kind === 'file' ? (
              <>
                {t.sourceUploaded} <span className="code">{source.name}</span>
              </>
            ) : null}
            {source.kind === 'none' ? t.sourceNone : null}
            {insights ? <span className="muted"> · {t.invoiceLines(f.count(insights.cleaning.rowsKept))}</span> : null}
          </span>
          {source.kind === 'file' ? (
            <button type="button" className="link" onClick={onDefault}>
              {t.backToDefault}
            </button>
          ) : null}
        </p>
      </div>
      <div className="masthead__actions">
        <span className="masthead__hint">{t.dropHint}</span>
        <SegmentedControl
          legend={t.langLegend}
          options={langs}
          value={lang}
          onChange={setLang}
          className="seg--compact"
        />
        <button
          type="button"
          className="btn btn--icon"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
          title={theme === 'dark' ? t.themeToLight : t.themeToDark}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button type="button" className="btn" onClick={() => input.current?.click()} disabled={busy}>
          <UploadIcon />
          {busy ? t.reading : t.loadCsv}
        </button>
        <input ref={input} type="file" accept=".csv,text/csv,text/plain" hidden onChange={picked} />
      </div>
    </header>
  );
}
