# 📊 Análise do Backend + N8N Integration

## 🏗️ **Arquitetura do Backend**

### **Stack Tecnológico:**
```json
{
  "runtime": "Node.js + TypeScript",
  "framework": "Express.js",
  "database": "PostgreSQL",
  "auth": "JWT + bcryptjs",
  "cloud": "Google Cloud (BigQuery + Sheets)",
  "automation": "n8n workflows",
  "cron": "node-cron"
}
```

### **Dependências Principais:**
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados principal
- **Google Cloud BigQuery** - Data warehouse para leads
- **Google Sheets** - Planilhas para dados
- **JWT + bcryptjs** - Autenticação e segurança
- **node-cron** - Tarefas agendadas
- **Zod** - Validação de dados

---

## 🤖 **Integração com N8N**

### **Workflow Principal: "AI Agents Platform - Complete Workflow"**

#### **1. Trigger Automático:**
```javascript
// Execução diária às 6h (horário de Brasília)
{
  "schedule": "daily at 6:00 AM",
  "timezone": "America/Sao_Paulo"
}
```

#### **2. Captura de Leads por CNAE:**
```sql
-- Query BigQuery para capturar empresas recém-criadas
SELECT 
  cnpj, data_inicio_atividade, cnae_fiscal_principal,
  uf, municipio, razao_social, porte_da_empresa,
  cep, telefone_1, telefone_2, email
FROM `basedosdados.br_me_cnpj.estabelecimentos`
WHERE data_inicio_atividade BETWEEN start_date AND end_date
  AND cnae_fiscal_principal = '{{ CNAE_CODE }}'
ORDER BY data_inicio_atividade DESC
LIMIT {{ LEAD_CAPTURE_LIMIT }}
```

#### **3. Processamento de Dados:**
- **Formatação** de telefones e CEP
- **Validação** de dados obrigatórios
- **Enriquecimento** com informações municipais
- **Deduplicação** de registros

#### **4. Armazenamento Multi-camada:**
- **PostgreSQL** - Dados estruturados
- **Google Sheets** - Visualização e análise
- **BigQuery** - Data warehouse histórico

---

## 🎯 **Funcionalidades do Sistema**

### **Captura Automática de Leads:**
```javascript
// Configurações via variáveis de ambiente
{
  "CNAE_DEFAULT": "5611201",           // Restaurantes
  "LEAD_CAPTURE_INTERVAL_DAYS": 7,    // Últimos 7 dias
  "LEAD_CAPTURE_LIMIT": 10000,        // Máximo por execução
  "LEAD_CAPTURE_BATCH_SIZE": 300,     // Lote de processamento
  "UF_FILTER": "SP"                   // Filtro por estado
}
```

### **CNAEs Suportados:**
- **5611201** - Restaurantes e similares
- **4711302** - Comércio varejista de mercadorias em geral
- **6201501** - Desenvolvimento de programas de computador

### **Dados Capturados:**
```typescript
interface Lead {
  cnpj: string;
  razao_social: string;
  data_inicio_atividade: Date;
  cnae_fiscal_principal: string;
  uf: string;
  municipio: string;
  porte_da_empresa: string;
  cep: string;
  telefone_1?: string;
  telefone_2?: string;
  email?: string;
  data_captura: Date;
}
```

---

## 🔄 **Fluxo de Dados**

### **1. Captura (N8N):**
```
BigQuery → Formatação → Validação → Batch Processing
```

### **2. Armazenamento:**
```
PostgreSQL ← Dados Estruturados
Google Sheets ← Visualização
BigQuery ← Histórico/Analytics
```

### **3. Disponibilização (Backend):**
```
API REST → Dashboards → Relatórios → Exportação
```

---

## 📡 **APIs do Backend**

### **Rotas Principais:**
```typescript
// Autenticação
POST /auth/login
POST /auth/register
GET  /auth/me

// Leads
GET  /leads
POST /leads
GET  /leads/:id
PUT  /leads/:id

// KPIs
GET  /kpi/metrics
GET  /kpi/conversion-rate
GET  /kpi/lead-sources

// Admin
GET  /admin/users
GET  /admin/stats
POST /admin/bulk-import

// Pagamentos
POST /payments/create
GET  /payments/:id
POST /payments/webhook

// Bot Configuration
GET  /bot/config
PUT  /bot/config
POST /bot/train
```

---

## ⚙️ **Configuração do N8N**

### **Credenciais Necessárias:**

#### **1. Google Cloud Service Account:**
```json
{
  "type": "service_account",
  "project_id": "seu-projeto",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "roles": [
    "BigQuery Data Viewer",
    "BigQuery Job User"
  ]
}
```

#### **2. Google Sheets OAuth2:**
```javascript
{
  "scope": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
  ]
}
```

#### **3. PostgreSQL:**
```env
POSTGRES_HOST=localhost
POSTGRES_DB=ai_agents
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

---

## 📊 **Métricas e Monitoramento**

### **KPIs Capturados:**
- **Leads por dia/semana/mês**
- **Taxa de conversão por CNAE**
- **Distribuição geográfica**
- **Porte das empresas**
- **Qualidade dos dados (% com email/telefone)**

### **Dashboards Disponíveis:**
- **Admin** - Visão completa + controle total
- **Pro** - Leads + prospecção ativa
- **Enterprise** - Analytics avançados
- **Basic** - Métricas essenciais

---

## 🚀 **Performance e Escalabilidade**

### **Otimizações Implementadas:**
```javascript
// Processamento em lotes
LEAD_CAPTURE_BATCH_SIZE: 300

// Delay entre requisições
LEAD_CAPTURE_DELAY_SECONDS: 3

// Cache de consultas
BIGQUERY_CACHE_TTL: 3600

// Índices de banco
CREATE INDEX idx_leads_cnae ON leads(cnae_fiscal_principal);
CREATE INDEX idx_leads_data ON leads(data_inicio_atividade);
```

### **Limites e Quotas:**
- **BigQuery**: 1TB/mês gratuito
- **Google Sheets**: 100 requests/100s/user
- **PostgreSQL**: Sem limite (depende da instância)

---

## 🔧 **Configuração e Deploy**

### **Variáveis de Ambiente:**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Google Cloud
GOOGLE_PROJECT_ID=seu-projeto-id
GOOGLE_SHEETS_ID=sua-planilha-id

# Lead Capture
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
LEAD_CAPTURE_BATCH_SIZE=300
UF_FILTER=SP

# Auth
JWT_SECRET=seu-jwt-secret
BCRYPT_ROUNDS=12

# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.com
```

### **Scripts Disponíveis:**
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Migração do banco
npm run migrate
```

---

## 🎯 **Casos de Uso**

### **1. Captura Automática de Restaurantes:**
```javascript
// Configuração
CNAE_DEFAULT=5611201
UF_FILTER=SP
LEAD_CAPTURE_LIMIT=1000

// Resultado: 1000 restaurantes novos de SP por dia
```

### **2. Prospecção de Software Houses:**
```javascript
// Configuração
CNAE_DEFAULT=6201501
LEAD_CAPTURE_INTERVAL_DAYS=30
LEAD_CAPTURE_LIMIT=5000

// Resultado: 5000 empresas de software dos últimos 30 dias
```

### **3. Análise de Mercado:**
```sql
-- Query personalizada no BigQuery
SELECT uf, COUNT(*) as total_empresas
FROM leads 
WHERE cnae_fiscal_principal = '5611201'
  AND data_inicio_atividade >= '2024-01-01'
GROUP BY uf
ORDER BY total_empresas DESC
```

---

## 🔒 **Segurança**

### **Implementações:**
- **JWT Authentication** para APIs
- **bcrypt** para hash de senhas
- **CORS** configurado
- **Rate limiting** nas APIs
- **Validação** com Zod
- **Sanitização** de inputs
- **Logs** de auditoria

---

## 📈 **Roadmap de Melhorias**

### **Próximas Funcionalidades:**
1. **Machine Learning** para scoring de leads
2. **Integração WhatsApp** para prospecção
3. **CRM nativo** integrado
4. **Webhooks** para integrações externas
5. **API GraphQL** para consultas complexas
6. **Real-time notifications** via WebSocket
7. **Backup automático** dos dados
8. **Multi-tenancy** para agências

---

## 🎉 **Conclusão**

O sistema integra perfeitamente:
- **Frontend React** (dashboards interativos)
- **Backend Node.js** (APIs e lógica de negócio)
- **N8N** (automação e captura de leads)
- **Google Cloud** (data warehouse e analytics)
- **PostgreSQL** (dados estruturados)

**Resultado:** Plataforma completa de captura e gestão de leads com automação total! 🚀