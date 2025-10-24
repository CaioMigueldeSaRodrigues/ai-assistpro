# 📚 Guia Completo de Configuração - AI Agents Platform

Este guia ensina como configurar toda a plataforma do zero, incluindo frontend, backend, dashboards HTML, N8N workflows e integrações com Google Cloud.

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração do Google Cloud](#2-configuração-do-google-cloud)
3. [Configuração do Banco de Dados](#3-configuração-do-banco-de-dados)
4. [Configuração do Backend](#4-configuração-do-backend)
5. [Configuração do Frontend](#5-configuração-do-frontend)
6. [Configuração dos Dashboards HTML](#6-configuração-dos-dashboards-html)
7. [Configuração do N8N](#7-configuração-do-n8n)
8. [Testes e Validação](#8-testes-e-validação)
9. [Deploy em Produção](#9-deploy-em-produção)

---

## 1. Pré-requisitos

Antes de começar, você precisa ter:

### Contas e Acessos:
- ✅ Conta Google (Gmail ou corporativa)
- ✅ Conta GitHub (para clonar o repositório)
- ✅ Acesso ao Google Cloud Console ([console.cloud.google.com](https://console.cloud.google.com))
- ✅ Conta N8N (cloud ou self-hosted)

### Software Instalado:
- ✅ Node.js 18+ ([nodejs.org](https://nodejs.org))
- ✅ PostgreSQL 14+ ([postgresql.org](https://www.postgresql.org))
- ✅ Git ([git-scm.com](https://git-scm.com))
- ✅ Editor de código (VS Code recomendado)

### Conhecimentos Básicos:
- Terminal/linha de comando
- Variáveis de ambiente
- Conceitos de API REST

---

## 2. Configuração do Google Cloud

### 2.1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. No topo da página, clique em **Select a project** → **NEW PROJECT**
3. Preencha:
   - **Project name:** `AI-Agents-Platform`
   - **Organization:** (sua organização ou deixe em branco)
4. Clique em **CREATE**
5. Aguarde a criação e selecione o projeto

### 2.2. Ativar APIs Necessárias

Você precisa ativar 3 APIs:

1. **BigQuery API** (para captura de leads)
2. **Google Sheets API** (para exportação de dados)
3. **Google Drive API** (para acesso às planilhas)

**Passos:**

1. No menu esquerdo, vá em **APIs & Services** → **Library**
2. Pesquise e ative cada uma:
   - Digite "BigQuery API" → Clique em **ENABLE**
   - Digite "Google Sheets API" → Clique em **ENABLE**
   - Digite "Google Drive API" → Clique em **ENABLE**

### 2.3. Criar Service Account (Conta de Serviço)

1. No menu esquerdo, vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **Service account**
3. Preencha:
   - **Service account name:** `ai-agents-backend`
   - **Service account ID:** (gerado automaticamente)
   - **Description:** `Backend service for AI Agents Platform`
4. Clique em **CREATE AND CONTINUE**
5. Em **Grant this service account access to project**, adicione as roles:
   - `BigQuery Data Viewer`
   - `BigQuery Job User`
   - `BigQuery User`
6. Clique em **CONTINUE** → **DONE**

### 2.4. Gerar Chave JSON da Service Account

1. Na lista de **Service Accounts**, clique na conta criada
2. Vá na aba **KEYS**
3. Clique em **ADD KEY** → **Create new key**
4. Selecione **JSON** → **CREATE**
5. O arquivo JSON será baixado automaticamente
6. **IMPORTANTE:** Guarde este arquivo em local seguro!

### 2.5. Criar Credenciais OAuth2 para N8N

#### Para BigQuery:

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Se aparecer aviso, clique em **CONFIGURE CONSENT SCREEN**:
   - **User Type:** External
   - **App name:** `AI Agents N8N`
   - **User support email:** seu email
   - **Developer contact:** seu email
   - Clique em **SAVE AND CONTINUE** até finalizar
4. De volta em **Create OAuth client ID**:
   - **Application type:** Web application
   - **Name:** `n8n-bigquery`
   - **Authorized redirect URIs:** 
     ```
     https://n8n.cloud/rest/oauth2-credential/callback
     ```
     *(ou seu domínio do n8n)*
5. Clique em **CREATE**
6. **Copie o Client ID e Client Secret** - vamos usar no N8N

#### Para Google Sheets:

1. Repita o processo acima
2. **Name:** `n8n-google-sheets`
3. Use o mesmo **Authorized redirect URI**
4. **Copie o Client ID e Client Secret**

### 2.6. Criar Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha: **+ Blank**
3. Nomeie como: `AI Agents - Leads`
4. Crie as seguintes abas:
   - `Leads` (para dados capturados)
   - `Config` (para configurações)
   - `Analytics` (para métricas)
5. Na aba `Leads`, adicione os cabeçalhos:
   ```
   CNPJ | Razão Social | CNAE | UF | Município | Porte | CEP | Telefone 1 | Telefone 2 | Email | Data Abertura | Data Captura | Score | Tier
   ```
6. **Copie o ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit
   ```

---

## 3. Configuração do Banco de Dados

### 3.1. Instalar PostgreSQL

**Windows:**
1. Baixe o instalador em [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Execute o instalador
3. Defina uma senha para o usuário `postgres`
4. Porta padrão: `5432`

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3.2. Criar Banco de Dados

1. Abra o terminal/prompt
2. Conecte ao PostgreSQL:
   ```bash
   psql -U postgres
   ```
3. Digite a senha definida na instalação
4. Crie o banco:
   ```sql
   CREATE DATABASE ai_agents;
   ```
5. Crie um usuário:
   ```sql
   CREATE USER ai_agents_user WITH PASSWORD 'sua_senha_segura';
   ```
6. Conceda permissões:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE ai_agents TO ai_agents_user;
   ```
7. Saia do psql:
   ```sql
   \q
   ```

### 3.3. Testar Conexão

```bash
psql -U ai_agents_user -d ai_agents -h localhost
```

Se conectar com sucesso, está pronto!

---

## 4. Configuração do Backend

### 4.1. Clonar o Repositório

```bash
git clone https://github.com/CaioMigueldeSaRodrigues/ai-assistpro.git
cd ai-assistpro
```

### 4.2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 4.3. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env`:
   ```env
   # Database
   DATABASE_URL=postgresql://ai_agents_user:sua_senha_segura@localhost:5432/ai_agents

   # Google Cloud
   GOOGLE_PROJECT_ID=ai-agents-platform
   GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
   GOOGLE_SHEETS_ID=seu_id_da_planilha_aqui

   # Security
   JWT_SECRET=gere_uma_string_aleatoria_segura_aqui
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

### 4.4. Adicionar Credenciais do Google Cloud

1. Crie a pasta de credenciais:
   ```bash
   mkdir credentials
   ```

2. Copie o arquivo JSON baixado do Google Cloud para:
   ```
   backend/credentials/google-cloud-key.json
   ```

3. **IMPORTANTE:** Adicione ao `.gitignore`:
   ```bash
   echo "credentials/" >> .gitignore
   ```

### 4.5. Executar Migrações do Banco

```bash
npm run migrate
```

Você verá mensagens confirmando a criação das tabelas:
- `leads`
- `subscriptions`
- `contacts`
- `business_hours`
- `holidays`
- `analytics_events`
- `agent_performance`

### 4.6. Iniciar o Backend

```bash
npm run dev
```

Você verá:
```
🚀 Server running on port 3001
📊 Environment: development
✅ Services initialized
```

### 4.7. Testar o Backend

Abra outro terminal e teste:

```bash
# Health check
curl http://localhost:3001/health

# Deve retornar:
# {"status":"ok","timestamp":"2024-10-24T..."}
```

---

## 5. Configuração do Frontend

### 5.1. Instalar Dependências do Frontend

Volte para a raiz do projeto:

```bash
cd ..
npm install
```

### 5.2. Configurar Variáveis de Ambiente

1. Crie o arquivo `.env`:
   ```bash
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   ```

### 5.3. Iniciar o Frontend

```bash
npm run dev
```

Você verá:
```
  VITE v5.4.19  ready in 2521 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.0.13:8080/
```

### 5.4. Testar o Frontend

1. Abra o navegador em: http://localhost:8080/
2. Você verá a landing page
3. Teste a navegação:
   - Scroll até "Explore Nossos Dashboards"
   - Clique em qualquer "Testar Dashboard"
   - Será redirecionado para o login

---

## 6. Configuração dos Dashboards HTML

### 6.1. Acessar o Sistema de Login

1. Acesse: http://localhost:8080/login.html
2. Você verá a página de login com contas de demonstração

### 6.2. Testar Credenciais

Use qualquer uma das credenciais:

| Nível | Email | Senha | Dashboard |
|-------|-------|-------|-----------|
| 👑 Admin | adm@adm.com | 1234 | Todos |
| 💼 Básico | basico@demo.com | 1234 | Básico |
| 🚀 Pro | pro@demo.com | 1234 | Pro |
| ⭐ Enterprise | enterprise@demo.com | 1234 | Enterprise |

### 6.3. Explorar os Dashboards

1. Faça login com `adm@adm.com / 1234`
2. Você será redirecionado para: http://localhost:8080/dashboard-admin.html
3. Explore:
   - Métricas globais no topo
   - Cards de planos (clique para alternar)
   - Iframe mostrando cada dashboard

### 6.4. Testar Logout

1. Clique no botão "Sair" no canto superior direito
2. Você será redirecionado para o login
3. A sessão será limpa do `localStorage`

---

## 7. Configuração do N8N

### 7.1. Criar Conta no N8N Cloud

1. Acesse [n8n.cloud](https://n8n.cloud)
2. Clique em **Sign up**
3. Crie sua conta (gratuita)
4. Confirme o email

### 7.2. Configurar Credenciais no N8N

#### BigQuery OAuth2:

1. No N8N, vá em **Credentials** → **Add Credential**
2. Pesquise e selecione: **Google BigQuery OAuth2 API**
3. Preencha:
   - **Client ID:** (do Google Cloud)
   - **Client Secret:** (do Google Cloud)
   - **Scope:** 
     ```
     https://www.googleapis.com/auth/bigquery
     ```
4. Clique em **Connect my account**
5. Faça login com sua conta Google
6. Aceite as permissões
7. Clique em **Save**

#### Google Sheets OAuth2:

1. No N8N, vá em **Credentials** → **Add Credential**
2. Pesquise e selecione: **Google Sheets OAuth2 API**
3. Preencha:
   - **Client ID:** (do Google Cloud)
   - **Client Secret:** (do Google Cloud)
   - **Scope:**
     ```
     https://www.googleapis.com/auth/spreadsheets
     https://www.googleapis.com/auth/drive.file
     ```
4. Clique em **Connect my account**
5. Faça login e aceite
6. Clique em **Save**

### 7.3. Importar Workflow de Captura de Leads

1. No N8N, vá em **Workflows** → **Add workflow**
2. Clique nos 3 pontos → **Import from File**
3. Selecione o arquivo: `n8n-workflows/ai-agents-complete-workflow.json`
4. O workflow será importado

### 7.4. Configurar Nodes do Workflow

#### Node "Set Lead Capture Config":

1. Clique no node
2. Edite os valores:
   ```json
   {
     "CNAE": "5611201",
     "janela_de_dias": 7,
     "uf_filtro": "",
     "limite_registros": 10000
   }
   ```
3. **CNAE:** Código do segmento (5611201 = Restaurantes)
4. **janela_de_dias:** Quantos dias atrás buscar
5. **uf_filtro:** Deixe vazio ou coloque "SP", "RJ", etc.

#### Node "Execute a SQL query" (BigQuery):

1. Clique no node
2. Em **Credential to connect with**, selecione a credencial do BigQuery criada
3. Verifique se o **Project ID** está correto
4. A query já está configurada

#### Node "Append or update row in sheet":

1. Clique no node
2. Em **Credential to connect with**, selecione a credencial do Google Sheets
3. Em **Document**, selecione sua planilha
4. Em **Sheet**, selecione a aba `Leads`
5. Verifique o mapeamento de colunas

### 7.5. Configurar Schedule Trigger

1. Clique no node "Daily Lead Capture - 6AM"
2. Configure:
   - **Trigger Interval:** Days
   - **Days Between Triggers:** 1
   - **Trigger at Hour:** 6
   - **Trigger at Minute:** 0
   - **Timezone:** America/Sao_Paulo

### 7.6. Testar o Workflow

1. Clique em **Execute Workflow** (botão play)
2. Aguarde a execução
3. Verifique:
   - Se os nodes ficaram verdes (sucesso)
   - Se os dados apareceram na planilha do Google Sheets
   - Se não houve erros

### 7.7. Ativar o Workflow

1. No topo, mude o toggle de **Inactive** para **Active**
2. O workflow agora executará automaticamente todos os dias às 6h

---

## 8. Testes e Validação

### 8.1. Testar Captura de Leads

#### Via Backend:

```bash
curl -X POST http://localhost:3001/api/leads/capture/trigger
```

#### Via N8N:

1. Execute o workflow manualmente
2. Verifique a planilha do Google Sheets

### 8.2. Testar Qualificação de Leads

```bash
curl -X POST http://localhost:3001/api/leads/qualify \
  -H "Content-Type: application/json" \
  -d '{
    "leads": [
      {
        "cnpj": "12345678000190",
        "razao_social": "Empresa Teste",
        "porte_da_empresa": "MEDIA",
        "email": "contato@empresa.com",
        "telefone_1": "11987654321",
        "cnae_fiscal_principal": "5611201",
        "uf": "SP",
        "data_inicio_atividade": "2024-01-15"
      }
    ]
  }'
```

### 8.3. Testar Analytics

```bash
# Obter dashboard completo
curl http://localhost:3001/api/analytics/dashboard

# Obter taxa de conversão
curl http://localhost:3001/api/analytics/conversion?start=2024-01-01&end=2024-01-31

# Obter horários populares
curl http://localhost:3001/api/analytics/popular-slots?days=30
```

### 8.3. Testar Configuração de Horários

```bash
# Obter configuração atual
curl http://localhost:3001/api/schedule/config

# Verificar se está em horário de funcionamento
curl http://localhost:3001/api/schedule/is-open

# Obter próximo horário disponível
curl http://localhost:3001/api/schedule/next-slot
```

### 8.5. Checklist de Validação

- [ ] Backend rodando sem erros
- [ ] Frontend acessível
- [ ] Login funcionando
- [ ] Dashboards carregando
- [ ] Logout funcionando
- [ ] N8N workflow executando
- [ ] Dados aparecendo no Google Sheets
- [ ] APIs respondendo corretamente
- [ ] Banco de dados populado

---

## 9. Deploy em Produção

### 9.1. Frontend (Vercel/Netlify)

#### Vercel:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify:

```bash
# Build
npm run build

# Deploy manual via Netlify UI
# Ou use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

### 9.2. Backend (Heroku/Railway)

#### Heroku:

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create ai-agents-backend

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=sua_chave_segura
heroku config:set GOOGLE_PROJECT_ID=seu_projeto
# ... outras variáveis

# Deploy
git push heroku main

# Executar migrações
heroku run npm run migrate
```

#### Railway:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Adicionar PostgreSQL
railway add postgresql

# Deploy
railway up
```

### 9.3. Configurar Domínio Personalizado

1. No Vercel/Netlify, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `app.seudominio.com`)
3. Configure os DNS conforme instruções
4. Aguarde propagação (até 48h)

### 9.4. Configurar HTTPS

- Vercel e Netlify configuram HTTPS automaticamente
- Heroku: use o addon SSL
- Railway: HTTPS automático

### 9.5. Atualizar URLs de Produção

1. Atualize o `.env` do frontend:
   ```env
   VITE_API_URL=https://api.seudominio.com/api
   ```

2. Atualize o `CORS_ORIGIN` do backend:
   ```env
   CORS_ORIGIN=https://app.seudominio.com
   ```

3. Atualize os **Authorized redirect URIs** no Google Cloud:
   ```
   https://app.seudominio.com/login
   ```

---

## 🎉 Conclusão

Parabéns! Você configurou toda a plataforma AI Agents:

✅ Google Cloud com BigQuery e Sheets  
✅ Banco de dados PostgreSQL  
✅ Backend Node.js com serviços avançados  
✅ Frontend React com landing page  
✅ Dashboards HTML interativos  
✅ Sistema de login completo  
✅ N8N workflows automatizados  
✅ Analytics e monitoramento  

### 📞 Suporte

- **Documentação:** Ver outros arquivos `.md` no repositório
- **Issues:** https://github.com/CaioMigueldeSaRodrigues/ai-assistpro/issues
- **Email:** Abra uma issue no GitHub

### 📚 Próximos Passos

1. Personalize os dashboards com sua marca
2. Configure CNAEs específicos do seu negócio
3. Integre com WhatsApp (Evolution API)
4. Adicione mais agentes de IA
5. Implemente machine learning para scoring

---

**🚀 Bom uso da plataforma!**
