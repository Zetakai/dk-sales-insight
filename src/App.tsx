import { useCallback, useState } from 'react';
import { BrandSection, RegionSection } from './ui/ChartViews';
import { DataQuality } from './ui/DataQuality';
import { Header } from './ui/Header';
import { Headline } from './ui/Headline';
import { AlertIcon, UploadIcon } from './ui/icons';
import { useLocale } from './ui/locale';
import { OutletsSection } from './ui/OutletsSection';
import { TelegramSection } from './ui/TelegramSection';
import { useFileDrop } from './ui/useFileDrop';
import { useInsights, type LoadError } from './ui/useInsights';
import { useTheme } from './ui/useTheme';

export default function App() {
  const { t, f } = useLocale();
  const data = useInsights();
  const { theme, toggle } = useTheme();
  const [qualityOpen, setQualityOpen] = useState(false);
  const { loadFile, loadDefault } = data;

  const onFile = useCallback(
    async (file: File) => {
      const result = await loadFile(file);
      // A file with skipped rows opens Data quality so the bad lines are in view, not hidden behind a click.
      if (result) setQualityOpen(result.cleaning.invalid.length > 0);
    },
    [loadFile],
  );
  const dragging = useFileDrop(onFile);

  const showInvalid = () => {
    setQualityOpen(true);
    requestAnimationFrame(() =>
      document.getElementById('data-quality')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  const { insights, source, error, busy } = data;
  const hasData = !!insights && insights.period.months.length > 0;
  const invalid = insights?.cleaning.invalid.length ?? 0;

  const errorText = (e: LoadError) =>
    e.kind === 'workbook'
      ? t.workbook
      : e.kind === 'tooLarge'
        ? t.tooLarge(e.mb)
        : e.kind === 'empty'
          ? t.emptyFile
          : e.kind === 'missingColumns'
            ? t.missingColumns(e.missing)
            : e.message;

  return (
    <div className="page">
      <Header
        insights={insights}
        source={source}
        busy={busy}
        theme={theme}
        onToggleTheme={toggle}
        onFile={onFile}
        onDefault={() => {
          void loadDefault();
          setQualityOpen(false);
        }}
      />

      <main className="report" aria-busy={busy}>
        {error ? (
          <div className="notice notice--error" role="alert">
            <AlertIcon />
            <div className="notice__body">
              <p className="notice__title">
                {t.couldNotLoad} <span className="code">{error.fileName}</span>
              </p>
              <p className="notice__text">{errorText(error)}</p>
              {insights ? <p className="notice__text muted">{t.stillShowing}</p> : null}
            </div>
            <button type="button" className="btn btn--quiet" onClick={data.dismissError}>
              {t.dismiss}
            </button>
          </div>
        ) : null}

        {insights && invalid > 0 && source.kind === 'file' ? (
          <div className="notice" role="status">
            <AlertIcon />
            <div className="notice__body">
              <p className="notice__title">{t.invalidTitle(f.count(invalid), invalid, source.name)}</p>
              <p className="notice__text">{t.invalidText}</p>
            </div>
            <button type="button" className="btn btn--quiet" onClick={showInvalid}>
              {t.showRows}
            </button>
          </div>
        ) : null}

        {hasData && insights ? (
          <>
            <Headline insights={insights} />
            <RegionSection insights={insights} />
            <BrandSection insights={insights} />
            <OutletsSection insights={insights} />
            <TelegramSection insights={insights} />
          </>
        ) : busy && !insights ? (
          <p className="loading" role="status">
            {t.loading}
          </p>
        ) : (
          <div className="sheet empty-state">
            <h2 className="sheet__title">{t.noSales}</h2>
            <p className="sheet__lede">{insights ? t.noSalesFile : t.noSalesNone}</p>
          </div>
        )}

        {insights ? (
          <DataQuality cleaning={insights.cleaning} open={qualityOpen || !hasData} onToggle={setQualityOpen} />
        ) : null}
      </main>

      {dragging ? (
        <div className="dropzone" aria-hidden="true">
          <div className="dropzone__box">
            <UploadIcon size={24} />
            <p className="dropzone__title">{t.dropTitle}</p>
            <p className="dropzone__text">{t.dropText}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
