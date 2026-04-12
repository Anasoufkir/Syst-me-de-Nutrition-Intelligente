import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import nutritionRoutes from './api/routes/nutrition.routes';
import { errorHandler } from './api/middlewares/errorHandler';

const app = express();

// ─── Sécurité ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env['CORS_ORIGINS'] ?? '*' }));
app.use(
  rateLimit({
    windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 900_000),
    max: Number(process.env['RATE_LIMIT_MAX'] ?? 100),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ─── Parsing ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Swagger UI ──────────────────────────────────────────────────────────────
if (process.env['SWAGGER_ENABLED'] !== 'false') {
  const specPath = join(__dirname, '../docs/api/openapi.yaml');
  const spec = yaml.load(readFileSync(specPath, 'utf8')) as object;
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}

// ─── Routes ──────────────────────────────────────────────────────────────────
const API_PREFIX = `/api/${process.env['API_VERSION'] ?? 'v1'}`;

app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({
    status: 'ok',
    version: process.env['npm_package_version'] ?? '1.0.0',
    environment: process.env['NODE_ENV'] ?? 'development',
  });
});

app.use(`${API_PREFIX}/nutrition`, nutritionRoutes);

// ─── Gestion des erreurs ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Démarrage ───────────────────────────────────────────────────────────────
const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? '0.0.0.0';

app.listen(PORT, HOST, () => {
  const env = process.env['NODE_ENV'] ?? 'development';
  console.log(`[nutrition-api] Listening on http://${HOST}:${PORT}/api/v1 (${env})`);
  if (process.env['SWAGGER_ENABLED'] !== 'false') {
    console.log(`[nutrition-api] Swagger UI → http://${HOST}:${PORT}/api/docs`);
  }
});

export default app;
