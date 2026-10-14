# Limitações conhecidas

- O MVP não executa pagamentos reais, WhatsApp, email, N8N, BigQuery ou Google Sheets.
- `MockBotRuntime` é heurístico e não é um modelo de IA.
- PIX cria pedido pendente; somente webhook autenticado pode alterar o status.
- Dashboard mostra apenas métricas derivadas das tabelas do MVP; satisfação permanece indisponível.
- O dashboard HTML legado continua no repositório por compatibilidade histórica e não deve ser usado para demonstrar autenticação.
- Não há refresh token, recuperação de senha, verificação de email ou gestão de sessões revogáveis.
- Testes de frontend ainda não foram adicionados; a cobertura automatizada desta etapa concentra-se no backend e nos builds.
- O lint global existente ainda falha por regras antigas/itens pré-existentes em componentes e analytics; builds e testes do MVP passam.
- O audit completo do frontend ainda reporta vulnerabilidades transitivas de desenvolvimento; resolver Tailwind 4/React Router 7 exige uma etapa própria de compatibilidade.
- O N8N workflow existente foi auditado como documentação/configuração não executada neste ambiente.
