import { useEffect, useMemo, useRef, useState } from 'react';
import type { Insights } from '../lib';
import { CheckIcon, CopyIcon, ReadTicks } from './icons';
import { useLocale } from './locale';
import { Section } from './Section';
import { summaryFor } from './useInsights';

const LIMIT = 900;

type CopyState = 'idle' | 'copied' | 'failed';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API blocked (plain http, old browser, permissions): fall back to a selected textarea.
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * The page's signature: the summary exactly as the team group will see it, one tap from the clipboard. It follows
 * the page language. What is shown is what is copied, character for character.
 */
export function TelegramSection({ insights }: { insights: Insights }) {
  const { t, f, lang } = useLocale();
  const [copy, setCopy] = useState<CopyState>('idle');
  const timer = useRef<number | undefined>(undefined);
  const summary = useMemo(() => summaryFor(insights, lang), [insights, lang]);
  // One paragraph, exactly as the brief asks: what is shown is what is copied.
  const text = summary.text;
  const [sentAt] = useState(() => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  const chars = [...text].length;
  const failed = summary.error !== null;
  const over = chars > LIMIT;

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => setCopy('idle'), [text]);

  const onCopy = async () => {
    const ok = await copyText(text);
    setCopy(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopy('idle'), 2400);
  };

  return (
    <Section title={t.tgTitle} className="sheet--telegram" lede={t.tgLede}>
      <div className="chat">
        <div className="chat__wall">
          <div className={failed ? 'bubble bubble--placeholder' : 'bubble'}>
            {failed ? <p className="bubble__flag">{t.summaryError}</p> : null}
            <p className="bubble__text" lang={failed ? 'en' : lang}>
              {failed ? summary.error : text}
              <span className="bubble__spacer" aria-hidden="true" />
            </p>
            <span className="bubble__meta" aria-hidden="true">
              {sentAt}
              <span className="bubble__ticks">
                <ReadTicks />
              </span>
            </span>
            <svg className="bubble__tail" width="9" height="16" viewBox="0 0 9 16" aria-hidden="true" focusable="false">
              <path d="M0 0v16h8.2c.5 0 .8-.6.4-1C4.4 10.8 1.2 6.2 0 0Z" />
            </svg>
          </div>
        </div>

        <div className="chat__bar">
          <p className={over ? 'chat__count chat__count--over' : 'chat__count'}>
            {t.chars(f.count(failed ? 0 : chars))}
            {over ? t.overLimit(f.count(LIMIT)) : ''}
          </p>
          <span className="sr-only" role="status" aria-live="polite">
            {copy === 'copied' ? t.copiedSr : copy === 'failed' ? t.copyFailed : ''}
          </span>
          {copy === 'failed' ? <p className="chat__hint">{t.copyFailed}</p> : null}
          <button type="button" className="btn btn--primary" onClick={onCopy} disabled={failed}>
            {copy === 'copied' ? <CheckIcon /> : <CopyIcon />}
            {copy === 'copied' ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </Section>
  );
}
