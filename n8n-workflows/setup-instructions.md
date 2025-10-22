# Guia de Configuração do n8n Workflow

## 🚀 Passo a Passo

### 1. Preparar Credenciais

#### Google Cloud Service Account
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um Service Account
3. Adicione roles:
   - BigQuery Data Viewer
   - BigQuery Job User
4. Gere chave JSON
5. No n8n: Settings > Credentials > Add Credential > Google Service Account
6. Cole o JSON da chave

#### Google Sheets OAuth2
1. No n8n: Settings > Credentials > Add Credential > Google Sheets OAuth2 API
2. Configure OAuth2 com as permissões necessárias
3. Autorize acesso à sua conta Google

#### PostgreSQL
1. No n8n: Settings > Credentials > Add Credential > Postgres
2. Configure:
   - Host: seu-host-postgres
   - Database: ai_agents
   - User: seu-usuario
   - Password: sua-senha
   - Port: 5432

### 2. Configurar Variáveis de Ambiente

No n8n, vá em Settings > Environment Variables e adicione:

```env
GOOGLE_PROJECT_ID=seu-projeto-id
GOOGLE_SHEETS_ID=sua-planilha-id
CNAE_DEFAULT=5611201
LEAD_CAPTURE_INTERVAL_DAYS=7
LEAD_CAPTURE_LIMIT=10000
LEAD_CAPTURE_BATCH_SIZE=300
LEAD_CAPTURE_DELAY_SECONDS=3
```

### 3. Importar Workflow

1. No n8n, clique em "Import from File"
2. Selecione o arquivo `ai-agents-complete-workflow.json`
3. Confirme a importação

### 4. Configurar Credenciais nos Nós

Após importar, configure as credenciais em cada nó:

#### BigQuery Node
- Credential: Selecione a credencial Google Service Account criada

#### Google Sheets Node  
- Credential: Selecione a credencial Google Sheets OAuth2 criada

#### PostgreSQL Nodes
- Credential: Selecione a credencial PostgreSQL criada

### 5. Testar Workflow

#### Teste Manual
1. Clique no nó "Webhook - Manual Trigger"
2. Copie a URL do webhook
3. Faça uma requisição POST:
```bash
curl -X POST https://seu-n8n.com/webhook/webhook-manual-trigger
```

#### Teste Automático
- O workflow executará automaticamente todos os dias às 6h (horário de Brasília)

## 🔧 Configurações Avançadas

### Personalizar CNAE
Altere a variável `CNAE_DEFAULT` para capturar leads de outros setores:
- 5611201: Restaurantes
- 4711302: Supermercados
- 6201501: Desenvolvimento de software

### Filtrar por Estado
Configure `UF_FILTER` para capturar apenas de um estado:
```env
UF_FILTER=SP  # Apenas São Paulo
```

### Ajustar Performance
- `LEAD_CAPTURE_BATCH_SIZE`: Tamanho do lote (padrão: 300)
- `LEAD_CAPTURE_DELAY_SECONDS`: Delay entre lotes (padrão: 3s)
- `LEAD_CAPTURE_LIMIT`: Limite total de registros (padrão: 10000)

## 📊 Monitoramento

### Logs de Execução
- Acesse Executions no n8n para ver logs detalhados
- Monitore erros e performance de cada nó

### Métricas
- Use o webhook KPI para obter métricas em tempo real
- Integre com dashboards externos (Grafana, etc.)

## 🚨 Troubleshooting

### Erro: "BigQuery permission denied"
- Verifique se o Service Account tem as roles corretas
- Confirme se a API BigQuery está habilitada

### Erro: "Google Sheets access denied"  
- Verifique se a planilha está compartilhada com a conta de serviço
- Confirme as permissões OAuth2

### Erro: "PostgreSQL connection failed"
- Verifique credenciais de conexão
- Confirme se as tabelas existem no banco

### Performance Lenta
- Reduza `LEAD_CAPTURE_BATCH_SIZE`
- Aumente `LEAD_CAPTURE_DELAY_SECONDS`
- Verifique limites de API do Google Cloud

## 🔄 Backup e Versionamento

### Exportar Workflow
1. Clique nos 3 pontos do workflow
2. Selecione "Download"
3. Salve o JSON como backup

### Controle de Versão
- Mantenha versões do workflow em Git
- Documente mudanças importantes
- Teste em ambiente de desenvolvimento primeiro