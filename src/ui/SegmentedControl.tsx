import { useId } from 'react';

type Option<T extends string> = { value: T; label: string; srLabel?: string; lang?: string };

type Props<T extends string> = {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * A two-or-more option switch built on native radio buttons: Tab reaches the group, arrow keys move the choice,
 * and screen readers announce "1 of 2, selected" without any ARIA of our own. `srLabel` gives a short visible label
 * ("ID") a full spoken name ("Bahasa Indonesia").
 */
export function SegmentedControl<T extends string>({ legend, options, value, onChange, className }: Props<T>) {
  const name = useId();
  return (
    <fieldset className={className ? `seg ${className}` : 'seg'}>
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="seg__option" title={o.srLabel}>
          <input
            className="seg__input"
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span className="seg__face" lang={o.lang}>
            {o.srLabel ? (
              <>
                <span aria-hidden="true">{o.label}</span>
                <span className="sr-only">{o.srLabel}</span>
              </>
            ) : (
              o.label
            )}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
