import type { Express } from 'express';
import { leadsRouter } from './leads.js';
import { subscriptionsRouter } from './subscriptions.js';
import { contactRouter } from './contact.js';
import { kpiRouter } from './kpi.js';
import { paymentsRouter, webhookRateLimit } from './payments.js';
import { botRouter } from './bot.js';
import { authRouter } from './auth.js';
import { adminRouter } from './admin.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export function setupRoutes(app: Express) {
  app.use('/api/auth', authRouter);
  app.use('/api/leads', requireAuth, requireAdmin, leadsRouter);
  app.use('/api/subscriptions', requireAuth, subscriptionsRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/kpi', requireAuth, kpiRouter);
  app.use('/api/payments/webhook', webhookRateLimit);
  app.use('/api/payments', requireAuth, paymentsRouter);
  app.use('/api/bot', requireAuth, botRouter);
  app.use('/api/admin', requireAuth, requireAdmin, adminRouter);
}
