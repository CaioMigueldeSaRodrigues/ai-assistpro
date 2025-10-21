# 🤖 AI Agents Platform - Plataforma Completa de Agentes de IA

Plataforma full-stack para venda e gestão de agentes de IA com captura automática de leads, sistema de assinaturas e dashboard de KPIs em tempo real.

**🎯 Projeto Lovable**: https://lovable.dev/projects/f1c67997-c6dc-48b5-ae89-8c37191c2001

## 🌟 Visão Geral

Esta é uma solução completa que combina:
- **Landing page moderna** para venda de agentes de IA
- **Backend robusto** para captura automática de leads
- **Dashboard de KPIs** em tempo real
- **Sistema de assinaturas** com 3 planos
- **Integração completa** com Google Cloud e Sheets

## 🏗️ Arquitetura

```
├── 🎨 Frontend (React + TypeScript)
│   ├── Landing page multilíngue (4 idiomas)
│   ├── Sistema de assinaturas integrado
│   ├── Dashboard de KPIs
│   └── Design system completo (shadcn/ui)
│
└── ⚙️ Backend (Node.js + Express)
    ├── API REST completa
    ├── Captura automática de leads (BigQuery)
    ├── Exportação para Google Sheets
    ├── Gestão de assinaturas (PostgreSQL)
    └── Cron jobs automatizados
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
- 🎯 **[Lovable Editor](https://lovable.dev/projects/f1c67997-c6dc-48b5-ae89-8c37191c2001)** - Editor visual

## 🎯 Funcionalidades Principais

### 🎨 Frontend
- ✅ **Landing page responsiva** com animações suaves
- ✅ **Multilíngue** (Português, Inglês, Espanhol, Chinês)
- ✅ **3 planos de assinatura** (Basic R$297, Pro R$697, Enterprise R$1.497)
- ✅ **Formulários integrados** com validação
- ✅ **Design system completo** (50+ componentes UI)
- ✅ **SEO otimizado** e performance

### ⚙️ Backend
- ✅ **Captura automática de leads** via Google BigQuery
- ✅ **Processamento em lotes** (300 registros por vez)
- ✅ **Exportação para Google Sheets** automática
- ✅ **Cron jobs** (execução diária às 6h)
- ✅ **API REST completa** com validação Zod
- ✅ **Dashboard de KPIs** em tempo real
- ✅ **Sistema de assinaturas** robusto

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

# Leads
GET    /api/leads/:cnpj              # Buscar lead por CNPJ
GET    /api/leads/stats/:cnae        # Estatísticas por CNAE
POST   /api/leads/capture/trigger    # Trigger manual

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

# Lead Capture
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
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

## 📈 Métricas e KPIs

O dashboard fornece:
- **Total de leads** capturados
- **Leads por período** (hoje, semana, mês)
- **Taxa de conversão** em tempo real
- **Tempo médio de resposta**
- **Conversas ativas**
- **Satisfação do cliente** (NPS)
- **Distribuição por plano**
- **Tendências de crescimento**

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
