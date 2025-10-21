# AI Agents Platform - Plataforma Completa

Plataforma completa de agentes de IA com captura automática de leads, gestão de assinaturas e dashboard de KPIs.

## 🏗️ Arquitetura

```
├── frontend/          # React + TypeScript + Vite
│   ├── Landing page multilíngue
│   ├── Integração com backend
│   └── Dashboard de KPIs
│
└── backend/           # Node.js + Express + TypeScript
    ├── API REST
    ├── Captura automática de leads (BigQuery)
    ├── Exportação para Google Sheets
    ├── Gestão de assinaturas (PostgreSQL)
    └── Cron jobs automatizados
```

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
# Acesse: http://localhost:8080
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run migrate
npm run dev
# API: http://localhost:3001
```

## 📚 Documentação Completa

- **Frontend**: Ver [src/README.md](src/README.md)
- **Backend**: Ver [backend/README.md](backend/README.md)
- **Setup Backend**: Ver [backend/SETUP.md](backend/SETUP.md)

## 🎯 Funcionalidades

### Frontend
- ✅ Landing page responsiva e multilíngue (pt-BR, en-US, es, zh-CN)
- ✅ 3 planos de assinatura (Basic, Pro, Enterprise)
- ✅ Formulário de contato integrado
- ✅ Animações com Framer Motion
- ✅ Design system completo (shadcn/ui)

### Backend
- ✅ Captura automática de leads via BigQuery
- ✅ Exportação para Google Sheets
- ✅ API REST completa
- ✅ Gestão de assinaturas
- ✅ Dashboard de KPIs em tempo real
- ✅ Cron jobs automatizados
- ✅ Validação com Zod

## 🛠️ Stack Tecnológica

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (50+ componentes)
- Framer Motion
- i18next
- TanStack Query

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Google BigQuery
- Google Sheets API
- node-cron
- Zod

## 📊 Workflow de Captura de Leads

Adaptado do n8n original:

1. **Schedule Trigger**: Diariamente às 6h
2. **BigQuery**: Busca empresas novas por CNAE
3. **Split in Batches**: Processa em lotes de 300
4. **Wait**: Delay de 3s entre lotes
5. **Google Sheets**: Exporta dados

## 🔐 Variáveis de Ambiente

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql://...
GOOGLE_PROJECT_ID=...
GOOGLE_SHEETS_ID=...
JWT_SECRET=...
```

## 📈 Endpoints da API

```
GET    /health
GET    /api/leads/:cnpj
POST   /api/leads/capture/trigger
POST   /api/subscriptions
GET    /api/subscriptions/:email
POST   /api/contact
GET    /api/kpi/metrics
GET    /api/kpi/trends
GET    /api/kpi/plans
```

## 🚀 Deploy

### Frontend (Lovable/Vercel)
```bash
npm run build
# Deploy automático via Lovable
```

### Backend (Heroku/Railway)
```bash
cd backend
heroku create
heroku addons:create heroku-postgresql
git push heroku main
```

## 📝 Licença

© 2025 AI Agents Platform. Todos os direitos reservados.
