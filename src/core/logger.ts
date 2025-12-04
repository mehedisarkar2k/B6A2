export const Logger = {
  info: (...args: unknown[]) => {
    console.log('[INFO]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
};
