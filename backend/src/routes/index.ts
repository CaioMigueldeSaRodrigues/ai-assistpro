import type { Express } from 'express';
import { leadsRouter } from './leads.js';
import { subscriptionsRouter } from './subscriptions.js';
import { contactRouter } from './contact.js';
import { kpiRouter } from './kpi.js';
import { paymentsRouter } from './payments.js';
import { botRouter } from './bot.js';

export function setupRoutes(app: Express) {
  app.use('/api/leads', leadsRouter);
  app.use('/api/subscriptions', subscriptionsRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/kpi', kpiRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/bot', botRouter);
}
