import { Router } from 'express';
import { db } from '../db/index.js';
import type { KPIMetrics } from '../types/index.js';

export const kpiRouter = Router();

// Get KPI metrics
kpiRouter.get('/metrics', async (req, res, next) => {
  try {
    // Total leads
    const totalLeadsResult = await db.query(
      'SELECT COUNT(*) as count FROM subscriptions WHERE user_id = $1', [req.user!.id]
    );
    
    // Leads today
    const todayLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions
       WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE`, [req.user!.id]
    );
    
    // Leads this week
    const weekLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions
       WHERE user_id = $1 AND created_at >= DATE_TRUNC('week', CURRENT_DATE)`, [req.user!.id]
    );
    
    // Leads this month
    const monthLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions
       WHERE user_id = $1 AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`, [req.user!.id]
    );
    
    const approvedOrdersResult = await db.query(
      `SELECT COUNT(*)::int AS count FROM orders WHERE user_id = $1 AND status = 'approved'`,
      [req.user!.id],
    );
    const userSubscriptionsResult = await db.query(
      'SELECT COUNT(*)::int AS count FROM subscriptions WHERE user_id = $1',
      [req.user!.id],
    );
    const conversationMetricsResult = await db.query(
      `SELECT COALESCE(AVG(response_time_ms), 0)::float AS avg_response_time,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 minutes')::int AS active_conversations
       FROM chat_conversations WHERE user_id = $1`,
      [req.user!.id],
    );
    const totalSubscriptions = Number(userSubscriptionsResult.rows[0].count);
    const approvedOrders = Number(approvedOrdersResult.rows[0].count);
    const conversionRate = totalSubscriptions ? approvedOrders / totalSubscriptions : 0;
    const avgResponseTime = Number(conversationMetricsResult.rows[0].avg_response_time);
    const activeConversations = Number(conversationMetricsResult.rows[0].active_conversations);

    const metrics: KPIMetrics = {
      total_leads: parseInt(totalLeadsResult.rows[0].count),
      leads_today: parseInt(todayLeadsResult.rows[0].count),
      leads_this_week: parseInt(weekLeadsResult.rows[0].count),
      leads_this_month: parseInt(monthLeadsResult.rows[0].count),
      conversion_rate: conversionRate,
      avg_response_time: avgResponseTime,
      active_conversations: activeConversations,
      customer_satisfaction: null,
    };
    
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Get subscription trends
kpiRouter.get('/trends', async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days as string) || 30, 1), 90);
    
    const result = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
       plan
       FROM subscriptions
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - ($2 * INTERVAL '1 day')
       GROUP BY DATE(created_at), plan
       ORDER BY date DESC`, [req.user!.id, days]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get plan distribution
kpiRouter.get('/plans', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT 
        plan,
        COUNT(*) as count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
       FROM subscriptions
       WHERE user_id = $1
       GROUP BY plan
       ORDER BY count DESC`, [req.user!.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});
