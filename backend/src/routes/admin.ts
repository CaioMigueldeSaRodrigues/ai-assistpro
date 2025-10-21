import { Router } from 'express';
import { db } from '../db/index.js';

export const adminRouter = Router();

// Dashboard overview
adminRouter.get('/dashboard', async (req, res, next) => {
  try {
    const [subscriptions, contacts, recentSubs, planDist] = await Promise.all([
      db.query('SELECT COUNT(*) FROM subscriptions'),
      db.query('SELECT COUNT(*) FROM contacts WHERE status = $1', ['pending']),
      db.query(`
        SELECT email, name, plan, created_at 
        FROM subscriptions 
        ORDER BY created_at DESC 
        LIMIT 10
      `),
      db.query(`
        SELECT plan, COUNT(*) as count 
        FROM subscriptions 
        GROUP BY plan
      `),
    ]);

    res.json({
      total_subscriptions: parseInt(subscriptions.rows[0].count),
      pending_contacts: parseInt(contacts.rows[0].count),
      recent_subscriptions: recentSubs.rows,
      plan_distribution: planDist.rows,
    });
  } catch (error) {
    next(error);
  }
});
