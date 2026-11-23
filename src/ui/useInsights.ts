import { useCallback, useEffect, useRef, useState } from 'react';
import { analyze, CsvFileError, telegramSummary } from '../lib';
import type { Insights, Lang, SummaryLayout } from '../lib';

/**
 * Default data: data/sales.csv (the sample export from the brief), else data/demo.csv (synthetic). Lazy glob, so a
 * missing sales.csv never breaks the build and each file is its own chunk, loaded only when it is the one shown.
 * Replace data/sales.csv with another export (same columns) to open on that, or load one with Load CSV.
 */
const DATA = import.meta.glob(['../../data/sales.csv', '../../data/demo.csv'], {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

export type Source = { kind: 'bundled' | 'demo' | 'file' | 'none'; name: string };

function defaultSource(): (Source & { load: () => Promise<string> }) | null {
  const entries = Object.entries(DATA);
  const sales = entries.find(([path]) => path.endsWith('/sales.csv'));
  if (sales) return { kind: 'bundled', name: 'sales.csv', load: sales[1] };
  const demo = entries.find(([path]) => path.endsWith('/demo.csv'));
  if (demo) return { kind: 'demo', name: 'demo.csv', load: demo[1] };
  return null;
}

/** Why a load failed. File-level CSV errors carry a code the page words in its own language. */
export type LoadError = { fileName: string } & (
  | { kind: 'workbook' }
  | { kind: 'tooLarge'; mb: number }
  | { kind: 'empty' }
  | { kind: 'missingColumns'; missing: string[] }
  | { kind: 'parse'; message: string }
);

function loadError(fileName: string, err: unknown): LoadError {
  if (err instanceof CsvFileError) {
    return err.code === 'empty' ? { fileName, kind: 'empty' } : { fileName, kind: 'missingColumns', missing: err.missing };
  }
  return { fileName, kind: 'parse', message: message(err) };
}

type State = {
  insights: Insights | null;
  source: Source;
  error: LoadError | null;
  busy: boolean;
};

export type Summary = { text: string; error: string | null };

/** The Telegram paragraph, or the error message when it cannot be written (never a crash). */
export function summaryFor(insights: Insights, lang: Lang, layout: SummaryLayout = 'paragraph'): Summary {
  try {
    return { text: telegramSummary(insights, lang, layout), error: null };
  } catch (err) {
    return { text: '', error: message(err) };
  }
}

const message = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Spreadsheet formats a manager might drop by mistake; they need a CSV export first. */
const WORKBOOK = /\.(xlsx|xlsm|xls|ods|numbers)$/i;
const MAX_BYTES = 50 * 1024 * 1024;

/**
 * The page's one data source. Starts on the default file; `loadFile` replaces it with an uploaded export. A file
 * that fails to load leaves the previous data on screen and reports why, so the page is never blank.
 */
export function useInsights() {
  const [state, setState] = useState<State>(() => {
    const d = defaultSource();
    return {
      insights: null,
      source: d ? { kind: d.kind, name: d.name } : { kind: 'none', name: '' },
      error: null,
      busy: !!d,
    };
  });

  // Loads are numbered and only the latest one may write: a slow file dropped first cannot overwrite a fast one
  // dropped after it, and the default load cannot overwrite an upload that beat it.
  const seq = useRef(0);

  const loadDefault = useCallback(async () => {
    const d = defaultSource();
    if (!d) return;
    const n = ++seq.current;
    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      const insights = analyze(await d.load());
      if (n !== seq.current) return;
      setState({ insights, source: { kind: d.kind, name: d.name }, error: null, busy: false });
    } catch (err) {
      if (n !== seq.current) return;
      setState((s) => ({ ...s, busy: false, error: loadError(d.name, err) }));
    }
  }, []);

  useEffect(() => {
    void loadDefault();
  }, [loadDefault]);

  const loadFile = useCallback(async (file: File): Promise<Insights | null> => {
    const n = ++seq.current;
    const fail = (error: LoadError) => {
      if (n === seq.current) setState((s) => ({ ...s, busy: false, error }));
      return null;
    };
    if (WORKBOOK.test(file.name)) return fail({ fileName: file.name, kind: 'workbook' });
    if (file.size > MAX_BYTES)
      return fail({ fileName: file.name, kind: 'tooLarge', mb: Math.round(file.size / 1024 / 1024) });

    setState((s) => ({ ...s, busy: true, error: null }));
    try {
      const insights = analyze(await file.text());
      if (n !== seq.current) return null;
      setState({ insights, source: { kind: 'file', name: file.name }, error: null, busy: false });
      return insights;
    } catch (err) {
      return fail(loadError(file.name, err));
    }
  }, []);

  const dismissError = useCallback(() => setState((s) => ({ ...s, error: null })), []);

  return { ...state, loadFile, loadDefault, dismissError };
}
