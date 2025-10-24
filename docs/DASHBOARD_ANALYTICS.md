# 📊 Dashboard e Analytics - AI Agents Platform

Sistema completo de analytics, configuração de bot e insights de marketing para a plataforma de agentes de IA.

## 🎯 Funcionalidades Implementadas

### ✅ **Dashboard Principal** (`/dashboard`)
- **Visão geral** com métricas principais
- **4 abas principais**: Overview, Analytics, Bot Config, Marketing
- **Métricas em tempo real** atualizadas a cada 30 segundos
- **Interface responsiva** para todos os dispositivos

### ✅ **Analytics de Tráfego**
- **Visitantes totais** e únicos
- **Visualizações de página** e taxa de rejeição
- **Duração média** das sessões
- **Páginas mais visitadas** com variação percentual
- **Fontes de tráfego** (orgânico, direto, social, etc.)
- **Dispositivos** (desktop, mobile, tablet)
- **Países** com distribuição geográfica
- **Atividade em tempo real**

### ✅ **Configuração do Bot**
- **Informações básicas**: nome, empresa, setor
- **Personalidade e tom**: profissional, casual, formal
- **Horário de funcionamento** configurável por dia
- **Regras de negócio**: tempo máximo, transferência
- **Integrações**: WhatsApp, Telegram, WebChat
- **Mensagens personalizadas** com variáveis
- **Teste em tempo real** do bot configurado

### ✅ **Insights de Marketing**
- **Performance de campanhas** (Google Ads, Facebook, LinkedIn)
- **ROAS e CAC** por campanha
- **Palavras-chave SEO** com posições e volume
- **Redes sociais** com engajamento
- **Email marketing** com taxas de abertura
- **Performance de conteúdo** com leads gerados
- **Recomendações automáticas** baseadas em dados

## 🚀 Como Acessar

### 1. Acesse o Dashboard
```
http://localhost:8080/dashboard
```

### 2. Navegue pelas Abas
- **Visão Geral**: Métricas principais e gráficos
- **Analytics**: Análise detalhada de tráfego
- **Configurar Bot**: Personalização do assistente
- **Marketing**: Insights de campanhas e SEO

## 📈 Métricas Disponíveis

### **Visão Geral**
- Conversas hoje: 47
- Taxa de conversão: 23%
- Tempo de resposta: 45s
- Satisfação: 4.8/5

### **Analytics de Tráfego**
- Visitantes totais: 12.847
- Visualizações: 45.621
- Taxa de rejeição: 34.2%
- Duração média: 3m 42s

### **Marketing**
- Investimento total: R$ 7.586
- ROAS médio: 4.37x
- Conversões: 53
- CAC médio: R$ 143

## 🤖 Configuração do Bot

### **Informações Básicas**
```javascript
{
  botName: "Assistente IA",
  company: "Minha Empresa", 
  industry: "tecnologia",
  description: "Descrição da empresa..."
}
```

### **Personalidade**
- **Profissional**: Tom corporativo e formal
- **Casual**: Linguagem descontraída
- **Formal**: Extremamente educado
- **Divertido**: Com humor e emojis

### **Horário de Funcionamento**
```javascript
{
  enabled: true,
  timezone: "America/Sao_Paulo",
  monday: { start: "09:00", end: "18:00", enabled: true },
  // ... outros dias
}
```

### **Regras de Negócio**
- Tempo máximo de conversa: 30 minutos
- Transferir para humano: Sim
- Coletar informações de leads: Sim
- Enviar follow-up automático: Sim
- Qualificar leads automaticamente: Sim

### **Mensagens Personalizadas**
```javascript
{
  welcome: "Olá! Sou o assistente virtual da {company}. Como posso ajudar?",
  offline: "Estamos offline. Deixe sua mensagem!",
  transfer: "Vou transferir você para um especialista.",
  goodbye: "Foi um prazer ajudar! Tenha um ótimo dia!"
}
```

## 📊 Sistema de Analytics

### **Google Analytics 4**
```javascript
// Inicialização automática
analytics.init();

// Eventos personalizados
analytics.trackPlanView('pro');
analytics.trackCheckoutStart('pro', 697);
analytics.trackPurchase('order-123', 'pro', 697);
```

### **Facebook Pixel**
```javascript
// Conversões
facebookPixel.trackPurchase(697, 'BRL');
facebookPixel.trackLead();
facebookPixel.trackInitiateCheckout(697);
```

### **Heatmaps (Hotjar)**
```javascript
// Sessões e mapas de calor
heatmap.trigger('bot_interaction');
heatmap.identify('user-123', { plan: 'pro' });
```

### **Analytics Personalizados**
```javascript
// Jornada do usuário
platformAnalytics.trackUserJourney('checkout_start');

// Testes A/B
platformAnalytics.trackABTest('pricing_page', 'variant_b');

// Performance
platformAnalytics.trackPerformance();
```

## 🔧 Backend APIs

### **Bot Configuration**
```http
GET    /api/bot/config/:userId     # Obter configuração
POST   /api/bot/config/:userId     # Salvar configuração
POST   /api/bot/test/:userId       # Testar bot
GET    /api/bot/analytics/:userId  # Analytics do bot
```

### **Exemplo de Configuração**
```json
{
  "botName": "Assistente IA",
  "company": "Minha Empresa",
  "personality": "profissional",
  "tone": "amigavel",
  "workingHours": {
    "enabled": true,
    "monday": { "start": "09:00", "end": "18:00", "enabled": true }
  },
  "businessRules": {
    "maxConversationTime": 30,
    "transferToHuman": true
  }
}
```

## 📱 Componentes Criados

### **Dashboard.tsx**
- Layout principal com 4 abas
- Métricas em cards responsivos
- Integração com hooks de dados

### **TrafficAnalytics.tsx**
- Análise detalhada de tráfego
- Gráficos e métricas visuais
- Dados em tempo real

### **BotConfiguration.tsx**
- Formulário completo de configuração
- Teste em tempo real
- Validação de dados

### **MarketingInsights.tsx**
- Performance de campanhas
- SEO e palavras-chave
- Recomendações automáticas

## 🎨 Design System

### **Cores e Temas**
- Suporte a tema claro/escuro
- Cores consistentes com a marca
- Gradientes e animações suaves

### **Componentes UI**
- Cards responsivos
- Badges de status
- Progress bars
- Switches e selects
- Tabs navegáveis

### **Animações**
- Framer Motion para transições
- Loading states
- Hover effects
- Scroll animations

## 📈 Dados de Demonstração

### **Campanhas de Marketing**
```javascript
{
  "Google Ads - Agentes IA": {
    budget: 5000,
    spent: 3240,
    conversions: 23,
    roas: 4.2
  },
  "Facebook Ads - Automação": {
    budget: 3000,
    spent: 2890,
    conversions: 18,
    roas: 3.8
  }
}
```

### **Palavras-chave SEO**
```javascript
[
  { keyword: "agente de ia", position: 3, volume: 8900 },
  { keyword: "chatbot empresa", position: 7, volume: 5400 },
  { keyword: "automação atendimento", position: 12, volume: 3200 }
]
```

## 🔐 Segurança e Privacidade

### **LGPD Compliance**
- Dados anonimizados
- Consentimento explícito
- Direito ao esquecimento
- Portabilidade de dados

### **Segurança**
- Validação de entrada
- Sanitização de dados
- Rate limiting
- Logs de auditoria

## 🚀 Próximas Funcionalidades

### **Analytics Avançados**
- [ ] Funil de conversão detalhado
- [ ] Cohort analysis
- [ ] Previsão de churn
- [ ] LTV (Lifetime Value)

### **Bot Intelligence**
- [ ] Machine Learning para respostas
- [ ] Análise de sentimento
- [ ] Detecção de intenções avançada
- [ ] Integração com OpenAI GPT

### **Marketing Automation**
- [ ] Campanhas automáticas
- [ ] Segmentação dinâmica
- [ ] Email drip campaigns
- [ ] Retargeting inteligente

### **Integrações**
- [ ] Zapier webhooks
- [ ] Slack notifications
- [ ] CRM sync (HubSpot, Pipedrive)
- [ ] Google Data Studio

## 📊 **Sistema Completo Implementado!**

O dashboard agora oferece:
- ✅ **Analytics completos** de tráfego e comportamento
- ✅ **Configuração avançada** do assistente virtual
- ✅ **Insights de marketing** com recomendações
- ✅ **Interface moderna** e responsiva
- ✅ **Dados em tempo real** com atualizações automáticas
- ✅ **Backend robusto** com APIs completas

**Acesse**: http://localhost:8080/dashboard para explorar todas as funcionalidades!