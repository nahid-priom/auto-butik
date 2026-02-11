/**
 * Central logger: no debug/log in production; error/warn only when needed.
 * Use this instead of console.log/console.debug to avoid production noise.
 */

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

export const logger = {
    debug(...args: unknown[]): void {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    },
    log(...args: unknown[]): void {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.log(...args);
        }
    },
    info(...args: unknown[]): void {
        if (isDev) {
            // eslint-disable-next-line no-console
            console.info(...args);
        }
    },
    warn(...args: unknown[]): void {
        // eslint-disable-next-line no-console
        console.warn(...args);
    },
    error(...args: unknown[]): void {
        // eslint-disable-next-line no-console
        console.error(...args);
    },
};
