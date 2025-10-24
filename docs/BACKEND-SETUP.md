# Guia de Configuração - Backend AI Agents

## 🚀 Setup Rápido

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

#### Opção A: Docker (Recomendado)
```bash
docker-compose up -d postgres
```

#### Opção B: PostgreSQL Local
Instale o PostgreSQL e crie o banco:
```sql
CREATE DATABASE ai_agents;
```

### 3. Configurar Google Cloud

#### 3.1 Criar Projeto no Google Cloud
1. Acesse https://console.cloud.google.com
2. Crie um novo projeto ou use existente
3. Anote o Project ID

#### 3.2 Habilitar APIs
```bash
gcloud services enable bigquery.googleapis.com
gcloud services enable sheets.googleapis.com
```

Ou pelo console:
- BigQuery API
- Google Sheets API

#### 3.3 Criar Service Account
1. IAM & Admin > Service Accounts
2. Create Service Account
3. Nome: `ai-agents-backend`
4. Roles necessárias:
   - BigQuery Data Viewer
   - BigQuery Job User
   - Google Sheets API (via OAuth)

5. Create Key > JSON
6. Salve o arquivo em `backend/credentials/google-cloud-key.json`

#### 3.4 Configurar Google Sheets
1. Crie uma planilha no Google Sheets
2. Compartilhe com o email do Service Account (permissão de Editor)
3. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### 4. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o `.env`:
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_agents

# Google Cloud
GOOGLE_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
GOOGLE_SERVICE_ACCOUNT_EMAIL=ai-agents-backend@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Sheets
GOOGLE_SHEETS_ID=1PXE5mWDUtLJD2IMFy2xo2xkkj7zJ4oiR4gv1chDN6fc

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# Lead Capture
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
LEAD_CAPTURE_BATCH_SIZE=300
LEAD_CAPTURE_DELAY_SECONDS=3
```

### 5. Executar Migrações
```bash
npm run migrate
```

### 6. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🧪 Testar a API

### Health Check
```bash
curl http://localhost:3001/health
```

### Trigger Manual de Captura de Leads
```bash
curl -X POST http://localhost:3001/api/leads/capture/trigger
```

### Criar Assinatura
```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "name": "João Silva",
    "company": "Empresa Teste",
    "phone": "(11) 99999-9999",
    "plan": "pro"
  }'
```

### Ver KPIs
```bash
curl http://localhost:3001/api/kpi/metrics
```

## 📊 Estrutura de Dados

### BigQuery - Base dos Dados
O sistema usa a base pública `basedosdados.br_me_cnpj`:
- `estabelecimentos`: Dados de CNPJs
- `empresas`: Razão social e porte
- `municipio`: Informações geográficas

### PostgreSQL - Dados da Aplicação
- `subscriptions`: Assinaturas de clientes
- `contacts`: Mensagens de contato

### Google Sheets - Leads Capturados
Colunas:
- cnpj, data_inicio_atividade, cnae_fiscal_principal
- uf, municipio, razao_social, porte_da_empresa
- cep, telefones, email
- data_captura

## 🔄 Cron Jobs

### Lead Capture Job
- **Frequência**: Diariamente às 6h (America/Sao_Paulo)
- **Função**: Busca empresas novas no BigQuery e exporta para Sheets
- **Configurável via**: `.env` (CNAE, dias, limite)

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
docker ps
# ou
pg_isready
```

### Erro: "Google Cloud authentication failed"
- Verifique se o arquivo JSON está no caminho correto
- Confirme que as APIs estão habilitadas
- Teste as credenciais:
```bash
gcloud auth activate-service-account --key-file=credentials/google-cloud-key.json
```

### Erro: "BigQuery permission denied"
- Verifique as roles do Service Account
- Necessário: BigQuery Data Viewer + BigQuery Job User

### Erro: "Google Sheets access denied"
- Compartilhe a planilha com o email do Service Account
- Permissão: Editor

## 📈 Monitoramento

### Logs
```bash
# Ver logs em tempo real
npm run dev

# Logs de produção
pm2 logs ai-agents-backend
```

### Métricas
- Total de leads capturados
- Assinaturas por plano
- Taxa de conversão
- Tempo de resposta da API

## 🚀 Deploy

### Heroku
```bash
heroku create ai-agents-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
heroku config:set GOOGLE_PROJECT_ID=...
# ... outras variáveis
git push heroku main
```

### Railway
```bash
railway init
railway add postgresql
railway up
```

### Docker
```bash
docker build -t ai-agents-backend .
docker run -p 3001:3001 --env-file .env ai-agents-backend
```