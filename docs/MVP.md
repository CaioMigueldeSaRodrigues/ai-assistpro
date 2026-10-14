# MVP técnico

## Fluxo comprovado

O caminho MVP é: criar conta ou entrar → selecionar um plano → criar pedido no adapter `MOCK_SANDBOX` → acessar dashboard → configurar o assistente → testar o runtime `MOCK` → consultar dados persistidos após reiniciar os processos.

O backend usa PostgreSQL, migrations SQL versionadas em `backend/src/db/migrations/` e sessão por cookie `HttpOnly`. O frontend usa `credentials: include` e não trata `localStorage` como autenticação.

## Operação local

1. Inicie PostgreSQL com `docker compose -f backend/docker-compose.yml up -d postgres`.
2. Copie `backend/.env.example` para `backend/.env` e preencha `DATABASE_URL`, `JWT_SECRET` e `PAYMENT_WEBHOOK_SECRET`.
3. Em `backend/`, execute `npm ci`, `npm run migrate`, `npm test` e `npm run build`.
4. Na raiz, execute `npm ci`, configure `VITE_API_URL` se necessário e execute `npm run build` ou `npm run dev`.

## Estado real

- Pagamentos: `MOCK_SANDBOX`, sem cobrança e sem aprovação aleatória.
- Assistente: `MockBotRuntime`, explicitamente retornado como `MOCK`.
- WhatsApp, N8N, BigQuery, Sheets e provedores reais: não configurados no caminho MVP.
- Analytics de satisfação: não há fonte real; a API retorna `null`.
