/**
 * Analytics and Monitoring Service
 * Registra e analisa métricas do sistema
 */

import { Pool } from 'pg';

interface ConversionMetric {
  date: string;
  leads_captured: number;
  leads_contacted: number;
  appointments_scheduled: number;
  appointments_confirmed: number;
  conversion_rate: number;
}

interface TimeSlotMetric {
  hour: number;
  day_of_week: number;
  request_count: number;
  avg_response_time_ms: number;
}

interface DemandMetric {
  date: string;
  day_of_week: number;
  total_requests: number;
  peak_hour: number;
  avg_response_time_ms: number;
}

interface AgentPerformance {
  agent_id: string;
  total_interactions: number;
  avg_response_time_ms: number;
  successful_appointments: number;
  failed_appointments: number;
  success_rate: number;
}

export class AnalyticsService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Inicializa tabelas de analytics
   */
  async initializeTables(): Promise<void> {
    // Tabela de eventos
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB NOT NULL,
        user_id VARCHAR(100),
        session_id VARCHAR(100),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Índices para performance
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type 
      ON analytics_events(event_type);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp 
      ON analytics_events(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_events_user 
      ON analytics_events(user_id);
    `);

    // Tabela de métricas agregadas
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_metrics (
        id SERIAL PRIMARY KEY,
        metric_type VARCHAR(50) NOT NULL,
        metric_value NUMERIC NOT NULL,
        dimensions JSONB,
        date DATE NOT NULL,
        hour INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(metric_type, date, hour, dimensions)
      );
    `);

    // Tabela de performance de agentes
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS agent_performance (
        id SERIAL PRIMARY KEY,
        agent_id VARCHAR(100) NOT NULL,
        interaction_type VARCHAR(50) NOT NULL,
        response_time_ms INTEGER,
        success BOOLEAN,
        error_message TEXT,
        metadata JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_agent_performance_agent 
      ON agent_performance(agent_id, timestamp);
    `);
  }

  /**
   * Registra evento
   */
  async trackEvent(
    eventType: string,
    eventData: Record<string, any>,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    await this.pool.query(`
      INSERT INTO analytics_events (event_type, event_data, user_id, session_id)
      VALUES ($1, $2, $3, $4)
    `, [eventType, JSON.stringify(eventData), userId, sessionId]);
  }

  /**
   * Registra performance do agente
   */
  async trackAgentPerformance(
    agentId: string,
    interactionType: string,
    responseTimeMs: number,
    success: boolean,
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.pool.query(`
      INSERT INTO agent_performance 
      (agent_id, interaction_type, response_time_ms, success, error_message, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [agentId, interactionType, responseTimeMs, success, errorMessage, JSON.stringify(metadata || {})]);
  }

  /**
   * Obtém taxa de conversão
   */
  async getConversionRate(startDate: string, endDate: string): Promise<ConversionMetric[]> {
    const result = await this.pool.query(`
      WITH daily_stats AS (
        SELECT 
          DATE(timestamp) as date,
          COUNT(*) FILTER (WHERE event_type = 'lead_captured') as leads_captured,
          COUNT(*) FILTER (WHERE event_type = 'lead_contacted') as leads_contacted,
          COUNT(*) FILTER (WHERE event_type = 'appointment_scheduled') as appointments_scheduled,
          COUNT(*) FILTER (WHERE event_type = 'appointment_confirmed') as appointments_confirmed
        FROM analytics_events
        WHERE timestamp BETWEEN $1 AND $2
        GROUP BY DATE(timestamp)
      )
      SELECT 
        date::text,
        leads_captured,
        leads_contacted,
        appointments_scheduled,
        appointments_confirmed,
        CASE 
          WHEN leads_captured > 0 
          THEN ROUND((appointments_scheduled::numeric / leads_captured::numeric) * 100, 2)
          ELSE 0 
        END as conversion_rate
      FROM daily_stats
      ORDER BY date
    `, [startDate, endDate]);

    return result.rows;
  }

  /**
   * Obtém horários mais requisitados
   */
  async getPopularTimeSlots(days: number = 30): Promise<TimeSlotMetric[]> {
    const result = await this.pool.query(`
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hour,
        EXTRACT(DOW FROM timestamp) as day_of_week,
        COUNT(*) as request_count,
        AVG(response_time_ms) as avg_response_time_ms
      FROM agent_performance
      WHERE timestamp >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY EXTRACT(HOUR FROM timestamp), EXTRACT(DOW FROM timestamp)
      ORDER BY request_count DESC
      LIMIT 20
    `);

    return result.rows;
  }

  /**
   * Obtém demanda por dia
   */
  async getDailyDemand(days: number = 30): Promise<DemandMetric[]> {
    const result = await this.pool.query(`
      WITH hourly_stats AS (
        SELECT 
          DATE(timestamp) as date,
          EXTRACT(DOW FROM timestamp) as day_of_week,
          EXTRACT(HOUR FROM timestamp) as hour,
          COUNT(*) as requests,
          AVG(response_time_ms) as avg_response_time
        FROM agent_performance
        WHERE timestamp >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(timestamp), EXTRACT(DOW FROM timestamp), EXTRACT(HOUR FROM timestamp)
      ),
      daily_peak AS (
        SELECT 
          date,
          day_of_week,
          hour as peak_hour,
          ROW_NUMBER() OVER (PARTITION BY date ORDER BY requests DESC) as rn
        FROM hourly_stats
      )
      SELECT 
        hs.date::text,
        hs.day_of_week::integer,
        SUM(hs.requests)::integer as total_requests,
        dp.peak_hour::integer,
        AVG(hs.avg_response_time)::integer as avg_response_time_ms
      FROM hourly_stats hs
      JOIN daily_peak dp ON hs.date = dp.date AND dp.rn = 1
      GROUP BY hs.date, hs.day_of_week, dp.peak_hour
      ORDER BY hs.date DESC
    `);

    return result.rows;
  }

  /**
   * Obtém performance dos agentes
   */
  async getAgentPerformance(agentId?: string, days: number = 30): Promise<AgentPerformance[]> {
    const whereClause = agentId ? 'AND agent_id = $2' : '';
    const params = agentId ? [days, agentId] : [days];

    const result = await this.pool.query(`
      SELECT 
        agent_id,
        COUNT(*) as total_interactions,
        AVG(response_time_ms)::integer as avg_response_time_ms,
        COUNT(*) FILTER (WHERE success = true AND interaction_type = 'appointment') as successful_appointments,
        COUNT(*) FILTER (WHERE success = false AND interaction_type = 'appointment') as failed_appointments,
        CASE 
          WHEN COUNT(*) FILTER (WHERE interaction_type = 'appointment') > 0
          THEN ROUND(
            (COUNT(*) FILTER (WHERE success = true AND interaction_type = 'appointment')::numeric / 
             COUNT(*) FILTER (WHERE interaction_type = 'appointment')::numeric) * 100, 
            2
          )
          ELSE 0 
        END as success_rate
      FROM agent_performance
      WHERE timestamp >= CURRENT_DATE - INTERVAL '${days} days'
      ${whereClause}
      GROUP BY agent_id
      ORDER BY total_interactions DESC
    `, params);

    return result.rows;
  }

  /**
   * Obtém tempo médio de resposta
   */
  async getAverageResponseTime(hours: number = 24): Promise<number> {
    const result = await this.pool.query(`
      SELECT AVG(response_time_ms)::integer as avg_response_time
      FROM agent_performance
      WHERE timestamp >= NOW() - INTERVAL '${hours} hours'
    `);

    return result.rows[0]?.avg_response_time || 0;
  }

  /**
   * Obtém estatísticas em tempo real
   */
  async getRealTimeStats(): Promise<Record<string, any>> {
    const [
      activeUsers,
      todayEvents,
      avgResponseTime,
      successRate
    ] = await Promise.all([
      this.getActiveUsers(),
      this.getTodayEventCount(),
      this.getAverageResponseTime(1),
      this.getSuccessRate(24)
    ]);

    return {
      active_users: activeUsers,
      today_events: todayEvents,
      avg_response_time_ms: avgResponseTime,
      success_rate: successRate,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtém usuários ativos
   */
  private async getActiveUsers(): Promise<number> {
    const result = await this.pool.query(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM analytics_events
      WHERE timestamp >= NOW() - INTERVAL '15 minutes'
      AND user_id IS NOT NULL
    `);

    return result.rows[0]?.count || 0;
  }

  /**
   * Obtém contagem de eventos de hoje
   */
  private async getTodayEventCount(): Promise<number> {
    const result = await this.pool.query(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE DATE(timestamp) = CURRENT_DATE
    `);

    return result.rows[0]?.count || 0;
  }

  /**
   * Obtém taxa de sucesso
   */
  private async getSuccessRate(hours: number): Promise<number> {
    const result = await this.pool.query(`
      SELECT 
        CASE 
          WHEN COUNT(*) > 0
          THEN ROUND((COUNT(*) FILTER (WHERE success = true)::numeric / COUNT(*)::numeric) * 100, 2)
          ELSE 0 
        END as success_rate
      FROM agent_performance
      WHERE timestamp >= NOW() - INTERVAL '${hours} hours'
    `);

    return result.rows[0]?.success_rate || 0;
  }

  /**
   * Limpa dados antigos (manutenção)
   */
  async cleanOldData(daysToKeep: number = 90): Promise<void> {
    await this.pool.query(`
      DELETE FROM analytics_events
      WHERE timestamp < CURRENT_DATE - INTERVAL '${daysToKeep} days'
    `);

    await this.pool.query(`
      DELETE FROM agent_performance
      WHERE timestamp < CURRENT_DATE - INTERVAL '${daysToKeep} days'
    `);

    console.log(`[Analytics] Cleaned data older than ${daysToKeep} days`);
  }

  /**
   * Gera relatório consolidado
   */
  async generateReport(startDate: string, endDate: string): Promise<Record<string, any>> {
    const [
      conversionMetrics,
      popularSlots,
      dailyDemand,
      agentPerformance
    ] = await Promise.all([
      this.getConversionRate(startDate, endDate),
      this.getPopularTimeSlots(30),
      this.getDailyDemand(30),
      this.getAgentPerformance(undefined, 30)
    ]);

    return {
      period: { start: startDate, end: endDate },
      conversion_metrics: conversionMetrics,
      popular_time_slots: popularSlots,
      daily_demand: dailyDemand,
      agent_performance: agentPerformance,
      generated_at: new Date().toISOString()
    };
  }
}

// Exportar instância (será inicializada com pool do banco)
export let analyticsService: AnalyticsService;

export function initializeAnalytics(pool: Pool): void {
  analyticsService = new AnalyticsService(pool);
}
