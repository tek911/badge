import type { NextFunction, Request, Response } from 'express';
import { httpRequestDuration } from '../observability/metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end({ status_code: String(res.statusCode) });
  });
  next();
}
