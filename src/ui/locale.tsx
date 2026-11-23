import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../lib';
import { STRINGS, type Strings } from './i18n';
import { makeFormat, type Format } from './text';

/** Same key as the pre-paint script in index.html, which sets <html lang> before React mounts. */
const KEY = 'sales-insight-lang';

function stored(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'en' || v === 'id' ? v : 'id';
  } catch {
    return 'id';
  }
}

type Locale = { lang: Lang; t: Strings; f: Format; setLang: (lang: Lang) => void };

const LocaleContext = createContext<Locale | null>(null);

/** Page language: Indonesian by default, remembered in this browser, mirrored on <html lang>. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(stored);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* storage blocked: the switch still works for this visit */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const value = useMemo(() => ({ lang, t: STRINGS[lang], f: makeFormat(lang), setLang }), [lang, setLang]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale outside LocaleProvider');
  return ctx;
}
