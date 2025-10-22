import { z } from 'zod';

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
  plan: z.enum(['basic', 'pro', 'enterprise']),
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
  customer_satisfaction: number;
}

// Payment Schema
export const PaymentSchema = z.object({
  plan: z.string(),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string(),
    document: z.string(),
    company: z.string().optional(),
  }),
  payment: z.object({
    method: z.enum(['credit_card', 'pix']),
    card: z.object({
      number: z.string(),
      name: z.string(),
      expiry: z.string(),
      cvv: z.string(),
      installments: z.string(),
    }).optional(),
    pixKey: z.string().optional(),
    qrCode: z.string().optional(),
  }),
  amount: z.number(),
});

export type Payment = z.infer<typeof PaymentSchema>;
