import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { apiRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { authenticationMiddleware } from './middleware/authentication';
import { metricsMiddleware } from './middleware/metrics';
import { getMetrics } from './observability/metrics';
import { logger } from './observability/logger';

const openApiDocument = JSON.parse(
  readFileSync(new URL('../openapi.json', import.meta.url), { encoding: 'utf-8' }),
);

export function createApp() {
  const app = express();
  app.use(express.json({ type: ['application/json', 'application/problem+json'] }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());
  app.use(metricsMiddleware);

  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
  app.get('/readyz', (_req, res) => res.json({ status: 'ready' }));
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(await getMetrics());
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(authenticationMiddleware);
  app.use('/v1', apiRoutes);

  app.use(errorHandler);

  app.on('error', (error) => {
    logger.error({ error }, 'Express app error');
  });

  return app;
}
