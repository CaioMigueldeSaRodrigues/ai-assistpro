# AI Agents Platform - Backend API

Backend Node.js/TypeScript para a plataforma de agentes de IA, adaptado do workflow n8n original.

## 🚀 Funcionalidades

### 1. Captura Automática de Leads
- **Integração com Google BigQuery** para buscar empresas por CNAE
- **Processamento em lotes** (300 registros por vez)
- **Exportação para Google Sheets** automática
- **Agendamento via Cron** (diariamente às 6h)
- **Trigger manual** via API

### 2. Gestão de Assinaturas
- Cadastro de novos clientes
- 3 planos: Basic, Pro, Enterprise
- Histórico completo de assinaturas
- Filtros e paginação

### 3. Formulário de Contato
- Recebimento de mensagens
- Armazenamento em banco de dados
- Status de atendimento

### 4. Dashboard de KPIs
- Total de leads capturados
- Leads por período (hoje, semana, mês)
- Taxa de conversão
- Tempo médio de resposta
- Conversas ativas
- Satisfação do cliente (NPS)
- Tendências e distribuição por plano

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta Google Cloud com:
  - BigQuery API habilitada
  - Google Sheets API habilitada
  - Service Account com credenciais

## 🔧 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_agents
GOOGLE_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
GOOGLE_SHEETS_ID=seu-sheet-id
JWT_SECRET=seu-secret-super-seguro
```

3. Coloque suas credenciais do Google Cloud:
```bash
mkdir credentials
# Copie seu arquivo JSON de credenciais para:
# credentials/google-cloud-key.json
```

4. Execute as migrações do banco:
```bash
npm run migrate
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Health Check
```
GET /health
```

### Leads
```
GET    /api/leads/:cnpj          # Buscar lead por CNPJ
GET    /api/leads/stats/:cnae    # Estatísticas por CNAE
POST   /api/leads/capture/trigger # Trigger manual de captura
```

### Assinaturas
```
POST   /api/subscriptions        # Criar assinatura
GET    /api/subscriptions/:email # Buscar por email
GET    /api/subscriptions        # Listar todas (paginado)
```

### Contato
```
POST   /api/contact              # Enviar mensagem
GET    /api/contact              # Listar mensagens (admin)
```

### KPIs
```
GET    /api/kpi/metrics          # Métricas gerais
GET    /api/kpi/trends           # Tendências por período
GET    /api/kpi/plans            # Distribuição por plano
```

## 🔄 Workflow de Captura de Leads

O sistema replica o workflow do n8n:

1. **Schedule Trigger**: Executa diariamente às 6h (America/Sao_Paulo)
2. **BigQuery Query**: Busca empresas novas por CNAE nos últimos 7 dias
3. **Split in Batches**: Divide em lotes de 300 registros
4. **Wait**: Aguarda 3 segundos entre lotes
5. **Google Sheets**: Adiciona/atualiza registros na planilha

### Trigger Manual
```bash
curl -X POST http://localhost:3001/api/leads/capture/trigger
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: subscriptions
- id, email, name, company, phone
- plan (basic/pro/enterprise)
- cnae, message, status
- created_at, updated_at

### Tabela: contacts
- id, name, email, phone
- subject, message, status
- created_at, updated_at

## 🔐 Segurança

- Validação de dados com Zod
- Variáveis de ambiente para credenciais
- CORS configurável
- Error handling centralizado
- SQL injection protection (prepared statements)

## 📊 Monitoramento

Logs estruturados para:
- Início/fim de jobs
- Erros e exceções
- Métricas de processamento
- Status de conexões

## 🚀 Deploy

### Heroku
```bash
heroku create ai-agents-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
git push heroku main
```

### Docker
```bash
docker build -t ai-agents-backend .
docker run -p 3001:3001 --env-file .env ai-agents-backend
```

## 📝 Próximos Passos

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Webhooks para eventos
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de notificações
- [ ] Logs estruturados (Winston/Pino)
- [ ] Testes automatizados
- [ ] CI/CD pipeline