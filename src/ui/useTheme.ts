import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/** Same key as the pre-paint script in index.html, which applies a stored choice before React mounts. */
const KEY = 'sales-insight-theme';
const QUERY = '(prefers-color-scheme: dark)';

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

const system = (): Theme => (typeof matchMedia === 'function' && matchMedia(QUERY).matches ? 'dark' : 'light');

/**
 * Follows the OS setting until the viewer flips the toggle; the choice is then pinned on <html data-theme> and
 * remembered in this browser (a convenience only: without storage the page still follows the OS).
 */
export function useTheme() {
  const [choice, setChoice] = useState<Theme | null>(stored);
  const [os, setOs] = useState<Theme>(system);

  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia(QUERY);
    const onChange = () => setOs(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (choice) root.dataset.theme = choice;
    else delete root.dataset.theme;
    try {
      if (choice) localStorage.setItem(KEY, choice);
      else localStorage.removeItem(KEY);
    } catch {
      /* storage blocked: the toggle still works for this visit */
    }
  }, [choice]);

  const theme = choice ?? os;
  const toggle = useCallback(() => setChoice(theme === 'dark' ? 'light' : 'dark'), [theme]);
  return { theme, toggle };
}
