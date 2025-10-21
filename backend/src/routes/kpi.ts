import { Router } from 'express';
import { db } from '../db/index.js';
import type { KPIMetrics } from '../types/index.js';

export const kpiRouter = Router();

// Get KPI metrics
kpiRouter.get('/metrics', async (req, res, next) => {
  try {
    // Total leads
    const totalLeadsResult = await db.query(
      'SELECT COUNT(*) as count FROM subscriptions'
    );
    
    // Leads today
    const todayLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    
    // Leads this week
    const weekLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions 
       WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)`
    );
    
    // Leads this month
    const monthLeadsResult = await db.query(
      `SELECT COUNT(*) as count FROM subscriptions 
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)`
    );
    
    // Conversion rate (mock - would need actual conversation data)
    const conversionRate = 0.23; // 23%
    
    // Average response time (mock - would need actual conversation data)
    const avgResponseTime = 45; // seconds
    
    // Active conversations (mock)
    const activeConversations = 127;
    
    // Customer satisfaction (mock - would need actual feedback data)
    const customerSatisfaction = 4.8; // out of 5

    const metrics: KPIMetrics = {
      total_leads: parseInt(totalLeadsResult.rows[0].count),
      leads_today: parseInt(todayLeadsResult.rows[0].count),
      leads_this_week: parseInt(weekLeadsResult.rows[0].count),
      leads_this_month: parseInt(monthLeadsResult.rows[0].count),
      conversion_rate: conversionRate,
      avg_response_time: avgResponseTime,
      active_conversations: activeConversations,
      customer_satisfaction: customerSatisfaction,
    };
    
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Get subscription trends
kpiRouter.get('/trends', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    
    const result = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        plan
       FROM subscriptions
       WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at), plan
       ORDER BY date DESC`
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
       GROUP BY plan
       ORDER BY count DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});
