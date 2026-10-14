import { Router } from 'express';
import { db } from '../db/index.js';
import { httpRateLimit } from '../middleware/httpRateLimit.js';
import { getBotRuntime } from '../services/botRuntime.js';
import { BotConfigSchema, BotTestSchema, type BotConfig } from '../types/index.js';

export const botRouter = Router();

const botTestRateLimit = httpRateLimit({ name: 'bot-test', maxRequests: 30, windowMs: 60 * 1000 });

export const defaultBotConfig: BotConfig = {
  botName: 'Assistente IA',
  company: 'Minha Empresa',
  industry: 'tecnologia',
  description: 'Empresa focada em soluções inovadoras.',
  personality: 'profissional',
  tone: 'amigavel',
  language: 'pt-BR',
  workingHours: {
    enabled: true,
    timezone: 'America/Sao_Paulo',
    monday: { start: '09:00', end: '18:00', enabled: true },
    tuesday: { start: '09:00', end: '18:00', enabled: true },
    wednesday: { start: '09:00', end: '18:00', enabled: true },
    thursday: { start: '09:00', end: '18:00', enabled: true },
    friday: { start: '09:00', end: '18:00', enabled: true },
    saturday: { start: '09:00', end: '14:00', enabled: false },
    sunday: { start: '09:00', end: '14:00', enabled: false },
  },
  businessRules: {
    maxConversationTime: 30,
    transferToHuman: true,
    collectLeadInfo: true,
    sendFollowUp: true,
    autoQualifyLeads: true,
  },
  integrations: { whatsapp: false, telegram: false, webchat: true, email: false },
  messages: {
    welcome: 'Olá! Sou o assistente virtual da {company}. Como posso ajudar?',
    offline: 'Estamos offline. Deixe uma mensagem para retorno.',
    transfer: 'Vou transferir você para um especialista.',
    goodbye: 'Foi um prazer ajudar você.',
  },
};

function rowToConfig(row: Record<string, unknown>): BotConfig {
  return BotConfigSchema.parse({
    botName: row.bot_name,
    company: row.company,
    industry: row.industry,
    description: row.description,
    personality: row.personality,
    tone: row.tone,
    language: row.language,
    workingHours: row.working_hours,
    businessRules: row.business_rules,
    integrations: row.integrations,
    messages: row.messages,
  });
}

async function getConfigForUser(userId: number): Promise<BotConfig> {
  const result = await db.query('SELECT * FROM bot_configurations WHERE user_id = $1', [userId]);
  return result.rows.length ? rowToConfig(result.rows[0]) : defaultBotConfig;
}

botRouter.get('/config', async (req, res, next) => {
  try {
    return res.json(await getConfigForUser(req.user!.id));
  } catch (error) {
    return next(error);
  }
});

botRouter.post('/config', async (req, res, next) => {
  try {
    const config = BotConfigSchema.parse(req.body);
    const result = await db.query(
      `INSERT INTO bot_configurations
       (user_id, bot_name, company, industry, description, personality, tone, language,
        working_hours, business_rules, integrations, messages)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (user_id) DO UPDATE SET
         bot_name = EXCLUDED.bot_name, company = EXCLUDED.company, industry = EXCLUDED.industry,
         description = EXCLUDED.description, personality = EXCLUDED.personality,
         tone = EXCLUDED.tone, language = EXCLUDED.language, working_hours = EXCLUDED.working_hours,
         business_rules = EXCLUDED.business_rules, integrations = EXCLUDED.integrations,
         messages = EXCLUDED.messages, updated_at = NOW()
       RETURNING *`,
      [req.user!.id, config.botName, config.company, config.industry, config.description,
        config.personality, config.tone, config.language, config.workingHours,
        config.businessRules, config.integrations, config.messages],
    );
    return res.json({ message: 'Configuration saved', config: rowToConfig(result.rows[0]), runtime: 'MOCK' });
  } catch (error) {
    return next(error);
  }
});

botRouter.post('/test', botTestRateLimit, async (req, res, next) => {
  try {
    const { message } = BotTestSchema.parse(req.body);
    const config = await getConfigForUser(req.user!.id);
    const runtime = getBotRuntime();
    const startedAt = Date.now();
    const botResponse = await runtime.respond({ message, config });
    const responseTimeMs = Date.now() - startedAt;
    await db.query(
      `INSERT INTO chat_conversations
       (user_id, platform, user_message, bot_response, response_time_ms)
       VALUES ($1, 'webchat', $2, $3, $4)`,
      [req.user!.id, message, botResponse, responseTimeMs],
    );
    return res.json({ userMessage: message, botResponse, runtime: runtime.kind, responseTimeMs });
  } catch (error) {
    return next(error);
  }
});

botRouter.get('/analytics', async (req, res, next) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days ?? 7), 1), 90);
    const result = await db.query(
      `SELECT COUNT(*)::int AS total_conversations,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS conversations_today,
        COALESCE(AVG(response_time_ms), 0)::float AS avg_response_time_ms,
        COUNT(DISTINCT user_phone)::int AS unique_users
       FROM chat_conversations
       WHERE user_id = $1 AND created_at >= NOW() - ($2 * INTERVAL '1 day')`,
      [req.user!.id, days],
    );
    return res.json({ overview: result.rows[0], period: `${days} days`, runtime: 'MOCK' });
  } catch (error) {
    return next(error);
  }
});
