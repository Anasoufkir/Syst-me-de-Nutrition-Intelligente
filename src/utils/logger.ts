type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = (process.env['LOG_LEVEL'] as LogLevel | undefined) ?? 'info';
const useJson = process.env['LOG_FORMAT'] === 'json';

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] <= LEVELS[currentLevel];
}

function format(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  if (useJson) {
    return JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta });
  }
  const ts = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${ts}] ${level.toUpperCase().padEnd(5)} ${message}${metaStr}`;
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('error')) console.error(format('error', message, meta));
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('warn')) console.warn(format('warn', message, meta));
  },
  info: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('info')) console.log(format('info', message, meta));
  },
  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('debug')) console.log(format('debug', message, meta));
  },
};
