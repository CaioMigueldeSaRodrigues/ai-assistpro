const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || error.message);
  }

  return response.json();
}

// Subscriptions
export const subscriptionsApi = {
  create: (data: {
    email: string;
    name: string;
    company?: string;
    phone?: string;
    plan: 'basic' | 'pro' | 'enterprise';
    cnae?: string;
    message?: string;
  }) => fetchApi('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getCurrent: () => fetchApi('/subscriptions/current'),
};

export const authApi = {
  register: (data: { name: string; email: string; password: string; plan?: 'basic' | 'pro' | 'enterprise' }) =>
    fetchApi<{ user: { id: number; name: string; email: string; plan: string } }>('/auth/register', {
      method: 'POST', body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    fetchApi<{ user: { id: number; name: string; email: string; plan: string } }>('/auth/login', {
      method: 'POST', body: JSON.stringify(data),
    }),
  me: () => fetchApi<{ user: { id: number; name: string; email: string; plan: string } }>('/auth/me'),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
};

// Contact
export const contactApi = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// KPIs
export const kpiApi = {
  getMetrics: () => fetchApi<{
    total_leads: number;
    leads_today: number;
    leads_this_week: number;
    leads_this_month: number;
    conversion_rate: number;
    avg_response_time: number;
    active_conversations: number;
    customer_satisfaction: number;
  }>('/kpi/metrics'),

  getTrends: (days: number = 30) => fetchApi(`/kpi/trends?days=${days}`),

  getPlans: () => fetchApi('/kpi/plans'),
};

// Leads
export const leadsApi = {
  getByCNPJ: (cnpj: string) => fetchApi(`/leads/${cnpj}`),
  
  getStats: (cnae: string, days: number = 30) => 
    fetchApi(`/leads/stats/${cnae}?days=${days}`),
  
  triggerCapture: () => fetchApi('/leads/capture/trigger', { method: 'POST' }),
};

// Bot Configuration
export const botApi = {
  getConfig: () => fetchApi('/bot/config'),
  
  saveConfig: (config: unknown) => fetchApi('/bot/config', {
    method: 'POST',
    body: JSON.stringify(config),
  }),
  
  testBot: (message: string) => fetchApi<{ botResponse: string }>('/bot/test', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  
  getAnalytics: (days: number = 7) => fetchApi(`/bot/analytics?days=${days}`),
};

// Payment
export const paymentApi = {
  processPayment: (data: {
    plan: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      document: string;
      company?: string;
    };
    payment: {
      method: 'credit_card' | 'pix';
      card?: Record<string, string>;
      pixKey?: string;
      qrCode?: string;
    };
    amount: number;
  }) => fetchApi('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getOrder: (orderId: string) => fetchApi(`/payments/orders/${orderId}`),

  generatePIX: (data: { amount: number; customer: Record<string, unknown> }) =>
    fetchApi('/payments/pix/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkPaymentStatus: (orderId: string) => 
    fetchApi(`/payments/status/${orderId}`),
};
