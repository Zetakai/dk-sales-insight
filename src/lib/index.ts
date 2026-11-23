/**
 * The data layer's public surface. The UI imports only from here.
 *   analyze(csvText)        -> Insights   (parse + clean + metrics)
 *   telegramSummary(i, l)   -> string     (one paragraph, plain text, ready to paste into Telegram)
 *   formatIdr / formatPct   -> display helpers shared by the UI and the summary
 */
export type * from './types';
export { analyze } from './metrics';
export { CsvFileError } from './csv';
export { telegramSummary } from './summary';
export { formatIdr, formatIdrFull, formatPct, formatMonth } from './format';
