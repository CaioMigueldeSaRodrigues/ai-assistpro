import { z } from 'zod';

export const PlanSchema = z.enum(['basic', 'pro', 'enterprise']);
export type Plan = z.infer<typeof PlanSchema>;

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  plan: PlanSchema.optional(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan: Plan;
};

// Lead Schema
export const LeadSchema = z.object({
  cnpj: z.string(),
  data_inicio_atividade: z.string(),
  cnae_fiscal_principal: z.string(),
  uf: z.string(),
  municipio: z.string(),
  razao_social: z.string(),
  porte_da_empresa: z.string(),
  cep: z.string().optional(),
  ddd_1: z.string().optional(),
  telefone_1: z.string().optional(),
  ddd_2: z.string().optional(),
  telefone_2: z.string().optional(),
  email: z.string().optional(),
  cep_formatado: z.string().optional(),
  telefone1_formatado: z.string().optional(),
  telefone2_formatado: z.string().optional(),
  telefones: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

// Subscription Schema
export const SubscriptionSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().optional(),
  plan: PlanSchema,
  cnae: z.string().optional(),
  message: z.string().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// Contact Schema
export const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export type Contact = z.infer<typeof ContactSchema>;

// Lead Capture Config
export interface LeadCaptureConfig {
  cnae: string;
  janela_de_dias: number;
  uf_filtro?: string;
  limite_registros: number;
}

// KPI Metrics
export interface KPIMetrics {
  total_leads: number;
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
  conversion_rate: number;
  avg_response_time: number;
  active_conversations: number;
  customer_satisfaction: number | null;
}

// Payment Schema
export const PaymentSchema = z.object({
  plan: PlanSchema,
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().trim().min(8).max(30),
    document: z.string().trim().min(5).max(30),
    company: z.string().optional(),
  }),
  payment: z.object({
    method: z.enum(['credit_card', 'pix']),
    card: z.object({
      number: z.string().regex(/^[0-9 ]{12,19}$/),
      name: z.string().trim().min(2).max(120),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/),
      cvv: z.string().regex(/^[0-9]{3,4}$/),
      installments: z.enum(['1', '2', '3', '6', '12']),
    }).optional(),
    pixKey: z.string().optional(),
    qrCode: z.string().optional(),
  }),
  amount: z.number().positive().finite(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const PaymentWebhookSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  status: z.enum(['pending', 'approved', 'declined', 'cancelled']),
  paymentId: z.string().min(1).max(255),
});

export const BotConfigSchema = z.object({
  botName: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  industry: z.string().trim().max(100),
  description: z.string().trim().max(2000),
  personality: z.string().trim().max(50),
  tone: z.string().trim().max(50),
  language: z.string().trim().max(10),
  workingHours: z.object({
    enabled: z.boolean(),
    timezone: z.string().max(80),
    monday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    tuesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    wednesday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    thursday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    friday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    saturday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
    sunday: z.object({ start: z.string(), end: z.string(), enabled: z.boolean() }),
  }),
  businessRules: z.object({
    maxConversationTime: z.number().int().min(1).max(1440),
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
    welcome: z.string().max(2000),
    offline: z.string().max(2000),
    transfer: z.string().max(2000),
    goodbye: z.string().max(2000),
  }),
});

export type BotConfig = z.infer<typeof BotConfigSchema>;

export const BotTestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});
