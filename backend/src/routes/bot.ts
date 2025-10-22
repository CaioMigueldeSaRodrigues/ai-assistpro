import { Router } from 'express';
import { db } from '../db/index.js';
import { z } from 'zod';

export const botRouter = Router();

const BotConfigSchema = z.object({
  botName: z.string().min(1),
  company: z.string().min(1),
  industry: z.string(),
  description: z.string(),
  personality: z.string(),
  tone: z.string(),
  language: z.string(),
  workingHours: z.object({
    enabled: z.boolean(),
    timezone: z.string(),
    monday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    tuesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    wednesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    thursday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    friday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    saturday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    sunday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
  }),
  businessRules: z.object({
    maxConversationTime: z.number(),
    transferToHuman: z.boolean(),
    collectLeadInfo: z.boolean(),
    sendFollowUp: z.boolean(),
    autoQualifyLeads: z.boolean(),
  }),
  integrations: z.object({
    whatsapp: z.boolean(),
    telegram: z.boolean(),
    webchat: z.boolean(),
    email: z.boolean(),
  }),
  messages: z.object({
    welcome: z.string(),
    offline: z.string(),
    transfer: z.string(),
    goodbye: z.string(),
  }),
});

// Get bot configuration
botRouter.get('/config/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      'SELECT * FROM bot_configurations WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Return default configuration
      const defaultConfig = {
        botName: "Assistente IA",
        company: "Minha Empresa",
        industry: "tecnologia",
        description: "Somos uma empresa focada em soluções inovadoras.",
        personality: "profissional",
        tone: "amigavel",
        language: "pt-BR",
        workingHours: {
          enabled: true,
          timezone: "America/Sao_Paulo",
          monday: { start: "09:00", end: "18:00", enabled: true },
          tuesday: { start: "09:00", end: "18:00", enabled: true },
          wednesday: { start: "09:00", end: "18:00", enabled: true },
          thursday: { start: "09:00", end: "18:00", enabled: true },
          friday: { start: "09:00", end: "18:00", enabled: true },
          saturday: { start: "09:00", end: "14:00", enabled: false },
          sunday: { start: "09:00", end: "14:00", enabled: false }
        },
        businessRules: {
          maxConversationTime: 30,
          transferToHuman: true,
          collectLeadInfo: true,
          sendFollowUp: true,
          autoQualifyLeads: true
        },
        integrations: {
          whatsapp: true,
          telegram: false,
          webchat: true,
          email: true
        },
        messages: {
          welcome: "Olá! Sou o assistente virtual da {company}. Como posso ajudar você hoje?",
          offline: "No momento estamos offline. Deixe sua mensagem que retornaremos em breve!",
          transfer: "Vou transferir você para um de nossos especialistas. Um momento, por favor.",
          goodbye: "Foi um prazer ajudar você! Tenha um ótimo dia!"
        }
      };
      
      return res.json(defaultConfig);
    }
    
    const config = result.rows[0];
    res.json({
      botName: config.bot_name,
      company: config.company,
      industry: config.industry,
      description: config.description,
      personality: config.personality,
      tone: config.tone,
      language: config.language,
      workingHours: config.working_hours,
      businessRules: config.business_rules,
      integrations: config.integrations,
      messages: config.messages
    });
  } catch (error) {
    next(error);
  }
});

// Save bot configuration
botRouter.post('/config/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const config = BotConfigSchema.parse(req.body);
    
    const result = await db.query(
      `INSERT INTO bot_configurations 
       (user_id, bot_name, company, industry, description, personality, tone, language, 
        working_hours, business_rules, integrations, messages, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         bot_name = $2, company = $3, industry = $4, description = $5,
         personality = $6, tone = $7, language = $8, working_hours = $9,
         business_rules = $10, integrations = $11, messages = $12, updated_at = NOW()
       RETURNING *`,
      [
        userId,
        config.botName,
        config.company,
        config.industry,
        config.description,
        config.personality,
        config.tone,
        config.language,
        JSON.stringify(config.workingHours),
        JSON.stringify(config.businessRules),
        JSON.stringify(config.integrations),
        JSON.stringify(config.messages)
      ]
    );
    
    res.json({
      message: 'Configuration saved successfully',
      config: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get bot analytics
botRouter.get('/analytics/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    
    // Get conversation stats
    const conversationStats = await db.query(
      `SELECT 
        COUNT(*) as total_conversations,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as conversations_today,
        AVG(CASE WHEN intent = 'pricing' THEN 1 ELSE 0 END) * 100 as pricing_intent_rate,
        AVG(CASE WHEN intent = 'demo' THEN 1 ELSE 0 END) * 100 as demo_intent_rate,
        COUNT(DISTINCT user_phone) as unique_users
       FROM chat_conversations 
       WHERE created_at >= NOW() - INTERVAL '${days} days'`
    );
    
    // Get hourly distribution
    const hourlyStats = await db.query(
      `SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as conversations
       FROM chat_conversations 
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY EXTRACT(HOUR FROM created_at)
       ORDER BY hour`
    );
    
    // Get platform distribution
    const platformStats = await db.query(
      `SELECT 
        platform,
        COUNT(*) as conversations,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
       FROM chat_conversations 
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY platform`
    );
    
    res.json({
      overview: conversationStats.rows[0],
      hourlyDistribution: hourlyStats.rows,
      platformDistribution: platformStats.rows,
      period: `${days} days`
    });
  } catch (error) {
    next(error);
  }
});

// Test bot configuration
botRouter.post('/test/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    
    // Get bot configuration
    const configResult = await db.query(
      'SELECT * FROM bot_configurations WHERE user_id = $1',
      [userId]
    );
    
    if (configResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bot configuration not found' });
    }
    
    const config = configResult.rows[0];
    
    // Simulate bot response based on configuration
    let response = "";
    
    if (message.toLowerCase().includes('olá') || message.toLowerCase().includes('oi')) {
      response = config.messages.welcome.replace('{company}', config.company);
    } else if (message.toLowerCase().includes('preço') || message.toLowerCase().includes('valor')) {
      response = `Ótima pergunta! Na ${config.company}, oferecemos diferentes planos para atender suas necessidades. Gostaria de saber mais sobre nossos preços?`;
    } else if (message.toLowerCase().includes('demo') || message.toLowerCase().includes('demonstração')) {
      response = `Ficaria feliz em mostrar como nossa solução pode ajudar a ${config.company}! Posso agendar uma demonstração personalizada para você.`;
    } else {
      response = `Obrigado por entrar em contato com a ${config.company}! Como posso ajudar você hoje?`;
    }
    
    // Apply personality and tone adjustments
    if (config.personality === 'casual') {
      response = response.replace('Obrigado', 'Valeu').replace('Gostaria', 'Quer');
    } else if (config.personality === 'formal') {
      response = response.replace('Oi', 'Bom dia').replace('Valeu', 'Agradeço');
    }
    
    res.json({
      userMessage: message,
      botResponse: response,
      config: {
        personality: config.personality,
        tone: config.tone,
        company: config.company
      }
    });
  } catch (error) {
    next(error);
  }
});