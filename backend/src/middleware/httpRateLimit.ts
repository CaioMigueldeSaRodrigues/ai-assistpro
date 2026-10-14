import type { NextFunction, Request, Response } from 'express';

interface HttpRateLimitOptions {
  name: string;
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

interface WindowState {
  count: number;
  resetAt: number;
}

function defaultKey(req: Request): string {
  return req.user ? `user:${req.user.id}` : `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;
}

export function httpRateLimit(options: HttpRateLimitOptions) {
  const store = new Map<string, WindowState>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    for (const [entryKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(entryKey);
    }
    const key = options.keyGenerator?.(req) ?? defaultKey(req);
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (current.count >= options.maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter,
      });
    }

    current.count += 1;
    return next();
  };
}

// This limiter is intentionally process-local for the MVP. A distributed store
// is required when multiple backend instances share the same public endpoint.
