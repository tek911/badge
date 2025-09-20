import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'status_code', 'route'],
  registers: [registry],
});

export const ingestionEventsCounter = new Counter({
  name: 'ingestion_events_total',
  help: 'Number of ingestion events processed',
  labelNames: ['source'],
  registers: [registry],
});

export function getMetrics(): Promise<string> {
  return registry.metrics();
}
