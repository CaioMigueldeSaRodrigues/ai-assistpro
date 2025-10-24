# 🤖 AI Agents Platform - Plataforma Completa de Agentes de IA

Plataforma full-stack para venda e gestão de agentes de IA com captura automática de leads, sistema de assinaturas, dashboards HTML interativos e analytics avançados.

**🎯 Projeto Lovable**: https://lovable.dev/projects/f1c67997-c6dc-48b5-ae89-8c37191c2001

## 🌟 Visão Geral

Esta é uma solução completa que combina:
- **Landing page moderna** para venda de agentes de IA
- **Sistema de login** com controle de acesso por plano
- **4 Dashboards HTML** interativos (Admin, Básico, Pro, Enterprise)
- **Backend robusto** com rate limiting e qualificação de leads
- **Analytics avançados** com métricas em tempo real
- **N8N workflows** para automação completa
- **Sistema de assinaturas** com 3 planos
- **Integração completa** com Google Cloud, BigQuery e Sheets

## 🏗️ Arquitetura

```
├── 🎨 Frontend (React + TypeScript)
│   ├── Landing page multilíngue (4 idiomas)
│   ├── Sistema de login integrado
│   ├── Dashboards HTML interativos (4 níveis)
│   ├── Sistema de assinaturas
│   └── Design system completo (shadcn/ui)
│
├── 📊 Dashboards HTML (Standalone)
│   ├── Dashboard Administrativo (acesso total)
│   ├── Dashboard Básico (atendimento 24/7)
│   ├── Dashboard Pro (atendimento + prospecção)
│   └── Dashboard Enterprise (analytics avançados)
│
├── ⚙️ Backend (Node.js + Express + TypeScript)
│   ├── API REST completa
│   ├── Rate limiting com exponential backoff
│   ├── Qualificação e scoring de leads
│   ├── Configuração dinâmica de horários
│   ├── Analytics e monitoramento
│   ├── Captura automática de leads (BigQuery)
│   ├── Exportação para Google Sheets
│   └── Gestão de assinaturas (PostgreSQL)
│
└── 🤖 N8N Workflows
    ├── Captura automática de leads por CNAE
    ├── Processamento em lotes
    ├── Integração WhatsApp (Evolution API)
    └── Agendamentos automáticos
```

## 🚀 Quick Start

### 1. Frontend
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite VITE_API_URL=http://localhost:3001/api

# Iniciar desenvolvimento
npm run dev
# Acesse: http://localhost:8080
```

### 🔐 Sistema de Login

**Credenciais de Demonstração:**
- **Admin:** adm@adm.com / 1234 (acesso total)
- **Básico:** basico@demo.com / 1234
- **Pro:** pro@demo.com / 1234
- **Enterprise:** enterprise@demo.com / 1234

**URLs dos Dashboards:**
- Login: http://localhost:8080/login.html
- Admin: http://localhost:8080/dashboard-admin.html
- Básico: http://localhost:8080/dashboard-basic.html
- Pro: http://localhost:8080/dashboard-pro.html
- Enterprise: http://localhost:8080/dashboard-enterprise.html

### 2. Backend
```bash
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Configure as variáveis (ver SETUP.md)

# Executar migrações
npm run migrate

# Iniciar servidor
npm run dev
# API: http://localhost:3001
```

## 📚 Documentação Detalhada

- 📖 **[Setup Backend Completo](backend/SETUP.md)** - Guia passo a passo
- 🔧 **[Documentação da API](backend/README.md)** - Endpoints e funcionalidades
- 🔐 **[Sistema de Login](public/README-LOGIN.md)** - Credenciais e acesso
- 📊 **[Análise Backend + N8N](ANALISE-BACKEND-N8N.md)** - Arquitetura completa
- 🚀 **[Melhorias Implementadas](MELHORIAS-IMPLEMENTADAS.md)** - Novos recursos
- 🔗 **[Integração Completa](INTEGRACAO-COMPLETA.md)** - React + HTML
- 🎯 **[Lovable Editor](https://lovable.dev/projects/f1c67997-c6dc-48b5-ae89-8c37191c2001)** - Editor visual

## 🎯 Funcionalidades Principais

### 🎨 Frontend React
- ✅ **Landing page responsiva** com animações suaves
- ✅ **Multilíngue** (Português, Inglês, Espanhol, Chinês)
- ✅ **Sistema de login** com autenticação JWT
- ✅ **3 planos de assinatura** (Basic R$297, Pro R$697, Enterprise R$1.497)
- ✅ **Seção de preview** dos dashboards
- ✅ **Formulários integrados** com validação
- ✅ **Design system completo** (50+ componentes UI)
- ✅ **SEO otimizado** e performance

### 📊 Dashboards HTML
- ✅ **4 níveis de acesso** (Admin, Básico, Pro, Enterprise)
- ✅ **Controle de sessão** com localStorage
- ✅ **Design responsivo** e moderno
- ✅ **Métricas em tempo real** simuladas
- ✅ **Formulários de configuração** funcionais
- ✅ **Sistema de tabs** (Pro/Enterprise)
- ✅ **Logout integrado** em todos os dashboards

### ⚙️ Backend Avançado
- ✅ **Rate limiting** com exponential backoff (5-60s)
- ✅ **Qualificação de leads** com scoring 0-100
- ✅ **Configuração dinâmica** de horários (banco de dados)
- ✅ **Analytics completo** (conversão, demanda, performance)
- ✅ **Captura automática de leads** via Google BigQuery
- ✅ **Processamento em lotes** (300 registros por vez)
- ✅ **Exportação para Google Sheets** automática
- ✅ **Cron jobs** (execução diária às 6h)
- ✅ **API REST completa** com validação Zod
- ✅ **Sistema de assinaturas** robusto

### 🤖 N8N Workflows
- ✅ **Captura por CNAE** configurável
- ✅ **Filtros avançados** (UF, porte, data)
- ✅ **Integração WhatsApp** (Evolution API)
- ✅ **Agendamentos automáticos** com IA
- ✅ **Error handling** robusto

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animações)
- **i18next** (internacionalização)
- **TanStack Query** (state management)
- **React Hook Form** + **Zod**

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** (dados da aplicação)
- **Google BigQuery** (captura de leads)
- **Google Sheets API** (exportação)
- **node-cron** (automação)
- **Zod** (validação)
- **JWT** + **bcryptjs** (autenticação)

### Serviços Avançados
- **Rate Limiter** (exponential backoff)
- **Lead Qualifier** (scoring e filtros)
- **Schedule Config** (horários dinâmicos)
- **Analytics Service** (métricas e KPIs)

## 📊 Workflow de Captura de Leads

Replica o workflow do n8n original:

1. **Trigger automático** às 6h (America/Sao_Paulo)
2. **Busca no BigQuery** por empresas novas (CNAE configurável)
3. **Processamento em lotes** de 300 registros
4. **Delay de 3 segundos** entre lotes
5. **Exportação para Sheets** com dados formatados

## 📡 API Endpoints

```bash
# Health Check
GET /health

# Autenticação
POST   /api/auth/login               # Login
POST   /api/auth/register            # Registro
GET    /api/auth/me                  # Usuário atual

# Leads
GET    /api/leads                    # Listar leads
GET    /api/leads/:cnpj              # Buscar lead por CNPJ
GET    /api/leads/stats/:cnae        # Estatísticas por CNAE
POST   /api/leads/capture/trigger    # Trigger manual
POST   /api/leads/qualify            # Qualificar leads

# Assinaturas
POST   /api/subscriptions            # Criar assinatura
GET    /api/subscriptions/:email     # Buscar por email
GET    /api/subscriptions            # Listar (admin)

# Contato
POST   /api/contact                  # Enviar mensagem
GET    /api/contact                  # Listar (admin)

# KPIs
GET    /api/kpi/metrics              # Métricas gerais
GET    /api/kpi/trends               # Tendências
GET    /api/kpi/plans                # Distribuição por plano

# Analytics
GET    /api/analytics/dashboard      # Dashboard completo
GET    /api/analytics/conversion     # Taxa de conversão
GET    /api/analytics/popular-slots  # Horários populares
GET    /api/analytics/agent-performance  # Performance dos agentes

# Configuração de Horários
GET    /api/schedule/config          # Obter configuração
PUT    /api/schedule/hours           # Atualizar horários
POST   /api/schedule/holiday         # Adicionar feriado
GET    /api/schedule/next-slot       # Próximo horário disponível

# Bot
GET    /api/bot/config               # Configuração do bot
PUT    /api/bot/config               # Atualizar configuração
POST   /api/bot/train                # Treinar bot
```

## 🔐 Configuração de Ambiente

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_agents

# Google Cloud
GOOGLE_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
GOOGLE_SHEETS_ID=sua-planilha-id

# Security
JWT_SECRET=seu-jwt-secret-super-seguro
BCRYPT_ROUNDS=12

# Lead Capture
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
LEAD_CAPTURE_BATCH_SIZE=300
LEAD_CAPTURE_DELAY_SECONDS=7

# Lead Qualification
MIN_LEAD_SCORE=50
REQUIRE_EMAIL=false
REQUIRE_PHONE=true

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

## 🚀 Deploy

### Frontend (Lovable/Vercel)
```bash
# Build de produção
npm run build

# Deploy automático via Lovable
# Ou manual: vercel --prod
```

### Backend (Heroku/Railway)
```bash
cd backend

# Heroku
heroku create ai-agents-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
git push heroku main

# Railway
railway init
railway add postgresql
railway up
```

### Docker
```bash
cd backend
docker-compose up -d
```

## 📈 Métricas e Analytics

### Dashboards Disponíveis:
- **Dashboard Admin**: Visão completa de todos os planos
- **Dashboard Básico**: Métricas de atendimento 24/7
- **Dashboard Pro**: Atendimento + prospecção ativa
- **Dashboard Enterprise**: Analytics avançados

### KPIs Monitorados:
- **Total de leads** capturados
- **Leads por período** (hoje, semana, mês)
- **Taxa de conversão** (lead → agendamento)
- **Tempo médio de resposta** por agente
- **Horários mais requisitados**
- **Demanda por dia da semana**
- **Performance dos agentes** (success rate)
- **Conversas ativas** em tempo real
- **Satisfação do cliente** (NPS)
- **Distribuição por plano**
- **Tendências de crescimento**
- **Score de qualificação** dos leads

## 🧪 Testes

```bash
# Frontend
npm run lint
npm run build

# Backend
cd backend
npm run dev
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/leads/capture/trigger
```

## 🤝 Como Editar

### Via Lovable (Recomendado)
1. Acesse o [Projeto Lovable](https://lovable.dev/projects/f1c67997-c6dc-48b5-ae89-8c37191c2001)
2. Use prompts em linguagem natural
3. Mudanças são commitadas automaticamente

### Via IDE Local
```bash
git clone https://github.com/CaioMigueldeSaRodrigues/ai-assistpro.git
cd ai-assistpro
npm install
npm run dev
```

### Via GitHub Codespaces
1. Clique em "Code" > "Codespaces" > "New codespace"
2. Edite diretamente no browser
3. Commit e push suas mudanças

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

- **Documentação**: Ver arquivos `/backend/SETUP.md` e `/backend/README.md`
- **Issues**: Abra uma issue no GitHub
- **Lovable**: Use o editor visual para mudanças rápidas

## 📄 Licença

© 2025 AI Agents Platform. Todos os direitos reservados.
