/** 16px line icons, drawn for this page. Decorative: every icon sits next to a text label or an aria-label. */
type P = { size?: number };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export const SunIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </svg>
);

export const MoonIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
  </svg>
);

export const UploadIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" />
  </svg>
);

export const CopyIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
  </svg>
);

export const CheckIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

export const ChevronIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M6 3.5L10.5 8 6 12.5" />
  </svg>
);

export const AlertIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.75v3.75M8 11.1v.15" />
  </svg>
);

/** Telegram's "read" mark: two offset checks. */
export const ReadTicks = () => (
  <svg
    width="16"
    height="11"
    viewBox="0 0 16 11"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable={false}
  >
    <path d="M1 6l3 3 6-7.5" />
    <path d="M7.5 8.4L8.2 9l6-7.5" />
  </svg>
);
