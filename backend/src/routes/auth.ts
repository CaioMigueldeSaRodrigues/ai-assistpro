import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { clearAuthCookie, issueToken, requireAuth, setAuthCookie } from '../middleware/auth.js';
import { httpRateLimit } from '../middleware/httpRateLimit.js';
import { LoginSchema, RegisterSchema, type AuthUser } from '../types/index.js';

export const authRouter = Router();

const registerRateLimit = httpRateLimit({ name: 'auth-register', maxRequests: 5, windowMs: 15 * 60 * 1000 });
const loginRateLimit = httpRateLimit({ name: 'auth-login', maxRequests: 10, windowMs: 15 * 60 * 1000 });

function publicUser(row: { id: number; email: string; name: string; role: 'user' | 'admin'; plan: AuthUser['plan'] }): AuthUser {
  return { id: row.id, email: row.email, name: row.name, role: row.role, plan: row.plan };
}

authRouter.post('/register', registerRateLimit, async (req, res, next) => {
  try {
    const input = RegisterSchema.parse(req.body);
    const existing = await db.query('SELECT 1 FROM users WHERE email = $1', [input.email.toLowerCase()]);
    if (existing.rowCount) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(input.password, 12);
    const result = await db.query(
      `INSERT INTO users (email, name, password_hash, plan)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, plan`,
      [input.email.toLowerCase(), input.name, passwordHash, input.plan ?? 'basic'],
    );
    const user = publicUser(result.rows[0]);
    setAuthCookie(res, issueToken(user));
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const input = LoginSchema.parse(req.body);
    const result = await db.query(
      'SELECT id, email, name, role, plan, password_hash FROM users WHERE email = $1',
      [input.email.toLowerCase()],
    );
    const row = result.rows[0];
    if (!row || !(await bcrypt.compare(input.password, row.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = publicUser(row);
    setAuthCookie(res, issueToken(user));
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});
