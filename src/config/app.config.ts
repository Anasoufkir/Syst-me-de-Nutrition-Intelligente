export const config = {
  server: {
    port: Number(process.env['PORT'] ?? 3000),
    host: process.env['HOST'] ?? '0.0.0.0',
    env: process.env['NODE_ENV'] ?? 'development',
  },
  api: {
    prefix: process.env['API_PREFIX'] ?? '/api',
    version: process.env['API_VERSION'] ?? 'v1',
  },
  security: {
    rateLimitWindowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 900_000),
    rateLimitMax: Number(process.env['RATE_LIMIT_MAX'] ?? 100),
    corsOrigins: process.env['CORS_ORIGINS'] ?? '*',
  },
  swagger: {
    enabled: process.env['SWAGGER_ENABLED'] !== 'false',
    path: process.env['SWAGGER_PATH'] ?? '/api/docs',
  },
  log: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    format: process.env['LOG_FORMAT'] ?? 'pretty',
  },
} as const;

export type AppConfig = typeof config;
