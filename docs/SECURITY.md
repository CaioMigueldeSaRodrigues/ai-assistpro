# Segurança do MVP

## Controles implementados

- bcrypt com custo 12 para senhas.
- JWT assinado com segredo externo de pelo menos 32 caracteres.
- cookie HttpOnly para a sessão; o frontend não autentica por localStorage.
- autorização por `req.user.id` e bloqueio de acesso cruzado a pedidos/configurações.
- Zod em auth, bot, subscriptions, pagamentos e webhook.
- CORS com origem configurável e credenciais explícitas.
- limite de corpo JSON de 256 KB.
- webhook de pagamento exige HMAC SHA-256 em `x-payment-signature`.
- cartão não é armazenado; o provider MOCK_SANDBOX recebe o dado apenas para produzir `last4`.
- mensagens de erro de produção não expõem detalhes internos.

## Limitações e riscos residuais

- O rate limiter HTTP do MVP é in-memory por processo e aplica limites separados a autenticação, `bot/test`, pagamentos e webhook; deve ser substituído por armazenamento distribuído antes de escalar horizontalmente. O rate limiter de retry de integrações permanece separado.
- O adapter de pagamento é sandbox e não pode ser promovido por configuração acidental.
- As páginas HTML legadas em `public/` ainda são demonstrações históricas com localStorage e credenciais hardcoded; não fazem parte do caminho SPA/MVP e não devem ser publicadas como superfície de produção.
- A API rejeita mutações com `Origin`/`Referer` cross-site e usa cookie `SameSite=Lax`; não há token CSRF dedicado, que continua recomendado para uma implantação pública com múltiplos frontends.
- Segredos reais não são versionados. `.env` e credenciais permanecem fora do Git.

## Dependências

Na última auditoria, o backend não apresentou vulnerabilidades (`npm audit --omit=dev`). O frontend ainda apresenta advisories transitivos principalmente no toolchain Tailwind 3 e 14 achados no relatório completo; React Router 6.30.6 ficou com advisories moderados que exigem migração major para a linha 7, e Tailwind 4 também seria breaking change. Essas atualizações ficam como pendência de compatibilidade, não foram aplicadas automaticamente.
