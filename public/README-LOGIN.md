# Sistema de Login - AI Agents Platform

## 🔐 Credenciais de Acesso

### Administrador (Acesso Total)
- **Email:** adm@adm.com
- **Senha:** 1234
- **Acesso:** Todos os dashboards (Básico, Pro, Enterprise)
- **Dashboard:** dashboard-admin.html

### Plano Básico
- **Email:** basico@demo.com
- **Senha:** 1234
- **Acesso:** Dashboard Básico
- **Dashboard:** dashboard-basic.html

### Plano Pro
- **Email:** pro@demo.com
- **Senha:** 1234
- **Acesso:** Dashboard Pro
- **Dashboard:** dashboard-pro.html

### Plano Enterprise
- **Email:** enterprise@demo.com
- **Senha:** 1234
- **Acesso:** Dashboard Enterprise
- **Dashboard:** dashboard-enterprise.html

## 📁 Estrutura de Arquivos

```
public/
├── login.html                  # Página de login
├── dashboard-admin.html        # Dashboard administrativo (acesso total)
├── dashboard.html              # Dashboard geral
├── dashboard-basic.html        # Dashboard Plano Básico
├── dashboard-pro.html          # Dashboard Plano Pro
├── dashboard-enterprise.html   # Dashboard Plano Enterprise
└── index-dashboards.html       # Página de seleção de planos
```

## 🚀 Como Usar

1. **Acesse a página de login:**
   - Abra `login.html` no navegador

2. **Faça login com uma das contas:**
   - Use as credenciais acima
   - Ou clique em uma das contas de demonstração

3. **Navegue pelo dashboard:**
   - Cada usuário é redirecionado para seu dashboard específico
   - O administrador pode visualizar todos os dashboards

## 🔒 Sistema de Autenticação

### Funcionalidades
- ✅ Login com email e senha
- ✅ Validação de credenciais
- ✅ Controle de acesso por plano
- ✅ Sessão persistente (localStorage)
- ✅ Logout funcional
- ✅ Redirecionamento automático
- ✅ Proteção de rotas

### Segurança
- Verificação de sessão em todas as páginas
- Redirecionamento automático se não autenticado
- Controle de acesso baseado em plano
- Logout limpa a sessão completamente

## 🎯 Níveis de Acesso

### Administrador
- Acesso a todos os dashboards
- Visualização de métricas globais
- Pode alternar entre todos os planos
- Dashboard com iframe para visualizar outros painéis

### Plano Básico
- Acesso apenas ao dashboard básico
- Configuração de assistente de atendimento
- Até 1.000 conversas/mês
- Integrações: WhatsApp e Site

### Plano Pro
- Acesso ao dashboard pro
- Assistente de atendimento + Prospecção
- Até 5.000 conversas/mês
- Integrações: WhatsApp, Site e CRM

### Plano Enterprise
- Acesso ao dashboard enterprise
- Analytics avançados
- Conversas ilimitadas
- Múltiplos agentes de IA
- Suporte dedicado 24/7

## 💻 Tecnologias

- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript Vanilla** - Lógica e autenticação
- **LocalStorage** - Persistência de sessão

## 🔧 Personalização

Para adicionar novos usuários, edite o objeto `users` em `login.html`:

```javascript
const users = {
    'novo@email.com': {
        password: 'senha',
        plan: 'basic', // basic, pro, enterprise, admin
        name: 'Nome do Usuário',
        dashboard: 'dashboard-basic.html'
    }
};
```

## 📝 Notas

- Este é um sistema de demonstração
- Em produção, use autenticação backend
- Senhas devem ser criptografadas
- Implemente tokens JWT para segurança
- Use HTTPS em produção
