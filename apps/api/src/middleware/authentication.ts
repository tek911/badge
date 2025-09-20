import type { NextFunction, Request, Response } from 'express';
import { findMockUser } from '../auth/mockUsers';

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ type: 'about:blank', title: 'Unauthorized', status: 401 });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const user = findMockUser(token);

  if (!user) {
    res.status(403).json({ type: 'about:blank', title: 'Forbidden', status: 403 });
    return;
  }

  (req as any).user = user;
  next();
}
