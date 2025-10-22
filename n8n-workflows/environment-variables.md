# Variáveis de Ambiente para n8n

Configure estas variáveis de ambiente no n8n antes de importar o workflow:

## 🔧 Configurações Principais

### Google Cloud
```env
GOOGLE_PROJECT_ID=seu-projeto-google-cloud
GOOGLE_BIGQUERY_CREDENTIAL_ID=id-da-credencial-bigquery
GOOGLE_SHEETS_CREDENTIAL_ID=id-da-credencial-sheets
GOOGLE_SHEETS_ID=1PXE5mWDUtLJD2IMFy2xo2xkkj7zJ4oiR4gv1chDN6fc
```

### PostgreSQL
```env
POSTGRES_CREDENTIAL_ID=id-da-credencial-postgres
```

### Lead Capture Settings
```env
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
LEAD_CAPTURE_BATCH_SIZE=300
LEAD_CAPTURE_DELAY_SECONDS=3
UF_FILTER=
```

## 📋 Pré-requisitos

### 1. Credenciais Google Cloud
- **BigQuery API**: Acesso à base `basedosdados.br_me_cnpj`
- **Google Sheets API**: Permissão de escrita na planilha

### 2. Credencial PostgreSQL
- Banco de dados com tabelas `subscriptions` e `contacts`
- Permissões de INSERT e SELECT

### 3. Google Sheets
- Planilha criada e compartilhada com a conta de serviço
- Primeira aba (Sheet1) configurada com cabeçalhos

## 🔗 Webhooks Gerados

Após importar, o n8n gerará URLs para:

```
POST /webhook/webhook-subscription     # Criar assinatura
POST /webhook/webhook-contact         # Formulário de contato  
GET  /webhook/api/kpi/metrics         # Métricas KPI
POST /webhook/webhook-manual-trigger  # Trigger manual
```

## 📊 Estrutura da Planilha Google Sheets

Cabeçalhos necessários na primeira linha:

```
cnpj | data_inicio_atividade | cnae_fiscal_principal | uf | municipio | razao_social | porte_da_empresa | cep | ddd_1 | telefone_1 | ddd_2 | telefone_2 | email | cep_formatado | telefone1_formatado | telefone2_formatado | telefones | data_captura
```

## 🗄️ Schema do Banco PostgreSQL

### Tabela: subscriptions
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  plan VARCHAR(50) NOT NULL,
  cnae VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: contacts
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```