import type { NextFunction, Request, Response } from 'express';

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { roles: string[] } | undefined;
    if (!user) {
      res.status(401).json({ type: 'about:blank', title: 'Unauthorized', status: 401 });
      return;
    }

    const allowed = user.roles.some((role) => roles.includes(role));
    if (!allowed) {
      res.status(403).json({ type: 'about:blank', title: 'Forbidden', status: 403 });
      return;
    }

    next();
  };
}
