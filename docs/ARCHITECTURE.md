# Arquitetura do MVP

## Camadas

- `backend/src/types`: contratos Zod e tipos de entrada/saída.
- `backend/src/routes`: transporte HTTP e autorização.
- `backend/src/middleware`: sessão, autorização e erros.
- `backend/src/db`: Pool PostgreSQL e migrations reproduzíveis.
- `backend/src/services`: adapters de runtime, pagamento e integrações legadas.
- `src/lib` e `src/hooks`: cliente HTTP e consumo de APIs.
- `src/pages` e `src/components`: UI preservada com o mínimo de conexão ao backend.

O domínio não chama Stripe, WhatsApp, N8N ou um runtime de IA diretamente. `PaymentProvider` e `BotRuntime` são interfaces; somente implementações explícitas podem ser ativadas.

## Autenticação

`POST /api/auth/register` e `POST /api/auth/login` emitem cookie `access_token` com `HttpOnly`, `SameSite=Lax` e expiração de oito horas. `GET /api/auth/me` resolve a identidade. Rotas protegidas usam essa identidade, não um `userId` enviado pelo cliente.

## Dados

`001_mvp_foundation.sql` cria users, subscriptions, orders, bot_configurations, chat_conversations, analytics, schedule e índices. `migrate.ts` registra cada arquivo em `schema_migrations` e é idempotente.

## Extensões futuras

Os adapters reais devem ser adicionados sem alterar o domínio: `StripePaymentProvider`, `OpenRouterBotRuntime`, `EvolutionWhatsAppProvider`, `BigQueryLeadSource` e `N8nAutomationProvider`.
