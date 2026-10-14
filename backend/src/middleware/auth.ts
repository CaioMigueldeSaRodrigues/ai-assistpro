/* eslint-disable @typescript-eslint/no-namespace */
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { AuthUser } from '../types/index.js';

const COOKIE_NAME = 'access_token';

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return secret;
}

export function issueToken(user: AuthUser): string {
  return jwt.sign(
    { sub: String(user.id), email: user.email, name: user.name, role: user.role, plan: user.plan },
    jwtSecret(),
    { expiresIn: '8h' },
  );
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(header.split(';').flatMap((part) => {
    const [key, ...value] = part.trim().split('=');
    return key && value.length ? [[key, decodeURIComponent(value.join('='))]] : [];
  }));
}

function readToken(req: Request): string | undefined {
  const authorization = req.header('authorization');
  if (authorization?.startsWith('Bearer ')) return authorization.slice(7);
  return parseCookies(req.header('cookie')).access_token;
}

export function toAuthUser(payload: jwt.JwtPayload): AuthUser {
  const id = Number(payload.sub);
  if (!Number.isInteger(id) || typeof payload.email !== 'string' || typeof payload.name !== 'string') {
    throw new Error('Invalid token subject');
  }
  if (payload.role !== 'user' && payload.role !== 'admin') throw new Error('Invalid token role');
  if (payload.plan !== 'basic' && payload.plan !== 'pro' && payload.plan !== 'enterprise') {
    throw new Error('Invalid token plan');
  }
  return { id, email: payload.email, name: payload.name, role: payload.role, plan: payload.plan };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const payload = jwt.verify(token, jwtSecret());
    req.user = toAuthUser(payload as jwt.JwtPayload);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  return next();
}

export function setAuthCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax${secure}; Max-Age=28800`,
  );
}

export function clearAuthCookie(res: Response) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax${secure}; Max-Age=0`);
}

export function safeEqual(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && crypto.timingSafeEqual(first, second);
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
