import { Router } from 'express';
import { SubscriptionSchema } from '../types/index.js';
import { db } from '../db/index.js';

export const subscriptionsRouter = Router();

// Create subscription
subscriptionsRouter.post('/', async (req, res, next) => {
  try {
    const data = SubscriptionSchema.parse(req.body);
    
    const result = await db.query(
      `INSERT INTO subscriptions (email, name, company, phone, plan, cnae, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [data.email, data.name, data.company, data.phone, data.plan, data.cnae, data.message]
    );
    
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get subscription by email
subscriptionsRouter.get('/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    
    const result = await db.query(
      'SELECT * FROM subscriptions WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get all subscriptions (admin)
subscriptionsRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM subscriptions');
    
    res.json({
      subscriptions: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});
