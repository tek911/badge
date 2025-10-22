import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../observability/logger';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({
      type: 'https://inventory.example.com/problems/validation-error',
      title: 'Validation Failed',
      status: 400,
      detail: error.issues.map((issue) => issue.message).join(', '),
      errors: error.flatten(),
    });
    return;
  }

  const status = error instanceof Error && 'status' in error ? Number((error as any).status) : 500;
  const message = error instanceof Error ? error.message : 'Unexpected error';

  logger.error({ error }, 'Unhandled error');

  res.status(status).json({
    type: 'about:blank',
    title: 'Internal Server Error',
    status,
    detail: message,
  });
}
