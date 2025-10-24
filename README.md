# 🤖 AI Agents Platform

> Plataforma completa para venda e gestão de agentes de IA com captura automática de leads, sistema de assinaturas e analytics avançados.

## 🎯 Objetivo

Desenvolver uma solução full-stack que permita:
- **Venda de agentes de IA** através de landing page moderna
- **Gestão de assinaturas** com 3 planos (Básico, Pro, Enterprise)
- **Captura automática de leads** via Google BigQuery
- **Dashboards interativos** para diferentes níveis de acesso
- **Analytics avançados** com métricas em tempo real
- **Automação completa** via N8N workflows

## 🏗️ Arquitetura

```
Frontend (React + TypeScript)
├── Landing page multilíngue
├── Sistema de autenticação
├── Dashboards por plano
└── Sistema de pagamentos

Backend (Node.js + Express)
├── API REST completa
├── Rate limiting inteligente
├── Qualificação de leads
├── Analytics e KPIs
└── Integração com serviços externos

Automação (N8N)
├── Captura de leads por CNAE
├── Processamento em lotes
├── Integração WhatsApp
└── Agendamentos automáticos
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Framer Motion** - Animações fluidas
- **i18next** - Internacionalização (4 idiomas)
- **TanStack Query** - Gerenciamento de estado
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem para backend
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **node-cron** - Agendamento de tarefas
- **Zod** - Validação de dados

### Serviços Cloud
- **Google BigQuery** - Data warehouse para leads
- **Google Sheets API** - Exportação de dados
- **Google Cloud Storage** - Armazenamento de arquivos
- **Evolution API** - Integração WhatsApp
- **Heroku/Railway** - Deploy do backend
- **Vercel** - Deploy do frontend

### Automação
- **N8N** - Plataforma de automação
- **Webhooks** - Comunicação entre serviços
- **Cron Jobs** - Execução programada
- **Rate Limiting** - Controle de requisições

## 📚 APIs Utilizadas

### Internas
- **Authentication API** - Login/registro de usuários
- **Leads API** - Captura e qualificação de leads
- **Subscriptions API** - Gestão de assinaturas
- **Analytics API** - Métricas e KPIs
- **Contact API** - Formulários de contato
- **Bot API** - Configuração de agentes

### Externas
- **Google BigQuery API** - Consulta de dados empresariais
- **Google Sheets API** - Exportação para planilhas
- **Evolution API** - Envio de mensagens WhatsApp
- **Stripe API** - Processamento de pagamentos
- **SendGrid API** - Envio de emails

## 📦 Bibliotecas Principais

### Produção
```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "express": "^4.18.0",
  "prisma": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.0.0",
  "react-hook-form": "^7.45.0",
  "zod": "^3.22.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "node-cron": "^3.0.0"
}
```

### Desenvolvimento
```json
{
  "vite": "^4.4.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.2.0",
  "eslint": "^8.45.0",
  "prettier": "^3.0.0",
  "nodemon": "^3.0.0"
}
```

## 🚀 Linguagens de Programação

- **TypeScript** (95%) - Frontend e Backend
- **JavaScript** (3%) - Configurações e scripts
- **SQL** (1%) - Queries de banco de dados
- **HTML/CSS** (1%) - Templates e estilos

## 🌟 Funcionalidades Principais

### 🎨 Frontend
- Landing page responsiva com animações
- Sistema de autenticação JWT
- 4 dashboards interativos (Admin, Básico, Pro, Enterprise)
- Multilíngue (PT, EN, ES, ZH)
- Sistema de pagamentos integrado
- Design system completo

### ⚙️ Backend
- API REST com rate limiting
- Qualificação automática de leads
- Analytics em tempo real
- Configuração dinâmica de horários
- Processamento em lotes
- Exportação para Google Sheets

### 🤖 Automação
- Captura de leads por CNAE
- Integração WhatsApp automática
- Agendamentos inteligentes
- Processamento de dados em lote
- Error handling robusto

## 📊 Métricas e Analytics

- **Taxa de conversão** lead → agendamento
- **Tempo médio de resposta** por agente
- **Horários mais requisitados**
- **Performance dos agentes**
- **Satisfação do cliente** (NPS)
- **Distribuição por plano**
- **Tendências de crescimento**
- **ROI por canal**

## 🔐 Segurança

- Autenticação JWT com refresh tokens
- Rate limiting com exponential backoff
- Validação de dados com Zod
- Sanitização de inputs
- CORS configurado
- Logs de auditoria
- Criptografia de senhas (bcrypt)

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Google Cloud Account
- N8N Instance

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ai-agents-platform.git
cd ai-agents-platform

# Frontend
npm install
cp .env.example .env
npm run dev

# Backend
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

### Configuração
1. Configure as variáveis de ambiente
2. Execute as migrações do banco
3. Configure as credenciais do Google Cloud
4. Importe os workflows do N8N

## 📁 Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços e APIs
│   └── hooks/             # Custom hooks
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Lógica de negócio
│   │   ├── db/           # Configuração do banco
│   │   └── types/        # Tipos TypeScript
├── public/               # Dashboards HTML
├── docs/                # Documentação técnica
├── n8n-workflows/       # Workflows de automação
└── README.md           # Este arquivo
```

## 📖 Documentação

Toda a documentação técnica está organizada no diretório `docs/`:

- **[Configuração Completa](docs/GUIA-CONFIGURACAO-COMPLETO.md)** - Setup detalhado
- **[Análise Backend + N8N](docs/ANALISE-BACKEND-N8N.md)** - Arquitetura técnica
- **[Integração Completa](docs/INTEGRACAO-COMPLETA.md)** - React + HTML
- **[Sistema de Login](docs/README-LOGIN.md)** - Autenticação
- **[Dashboard Analytics](docs/DASHBOARD_ANALYTICS.md)** - Métricas
- **[Melhorias Implementadas](docs/MELHORIAS-IMPLEMENTADAS.md)** - Changelog
- **[Guia Rápido](docs/GUIA-RAPIDO.md)** - Como usar

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Documentação**: Consulte o diretório `docs/`
- **Issues**: Abra uma issue no GitHub
- **Email**: contato@aiagentsplatform.com

---

**Desenvolvido com ❤️ para revolucionar o atendimento automatizado**