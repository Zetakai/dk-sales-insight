import { useId, type ReactNode } from 'react';

type Props = {
  title: string;
  lede?: ReactNode;
  tools?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** One sheet of the report: a heading with its one-line purpose, the section's own switches on the right. */
export function Section({ title, lede, tools, extra, className, children }: Props) {
  const id = useId();
  return (
    <section className={`sheet${className ? ` ${className}` : ''}`} aria-labelledby={id}>
      <header className="sheet__head">
        <div className="sheet__heading">
          <h2 id={id} className="sheet__title">
            {title}
          </h2>
          {lede ? <p className="sheet__lede">{lede}</p> : null}
          {extra}
        </div>
        {tools ? <div className="sheet__tools">{tools}</div> : null}
      </header>
      {children}
    </section>
  );
}
