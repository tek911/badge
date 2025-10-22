import http from 'node:http';
import { env } from './config/env';
import { createApp } from './app';
import { logger } from './observability/logger';

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'API server listening');
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Failed to start API server');
  process.exit(1);
});
