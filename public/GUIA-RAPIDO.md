# 🚀 Guia Rápido - AI Agents Platform

## Como Começar

### 1️⃣ Acesse a Plataforma
Abra o arquivo `index.html` ou `login.html` no seu navegador.

### 2️⃣ Faça Login

#### 👑 **ADMINISTRADOR (Recomendado para Análise)**
```
Email: adm@adm.com
Senha: 1234
```
**Acesso:** Todos os dashboards em um único painel

#### 💼 **Plano Básico**
```
Email: basico@demo.com
Senha: 1234
```
**Recursos:** Atendimento 24/7, até 1.000 conversas/mês

#### 🚀 **Plano Pro**
```
Email: pro@demo.com
Senha: 1234
```
**Recursos:** Atendimento + Prospecção Ativa

#### ⭐ **Plano Enterprise**
```
Email: enterprise@demo.com
Senha: 1234
```
**Recursos:** Analytics Avançados + Suporte Dedicado

---

## 📊 Dashboards Disponíveis

### Dashboard Administrativo
- **Arquivo:** `dashboard-admin.html`
- **Acesso:** Apenas administrador
- **Recursos:**
  - Visualização de todos os planos
  - Métricas globais da plataforma
  - Alternância entre dashboards via iframe
  - Estatísticas consolidadas

### Dashboard Básico
- **Arquivo:** `dashboard-basic.html`
- **Recursos:**
  - Configuração do assistente de atendimento
  - Estatísticas de conversas
  - Tempo de resposta
  - Taxa de satisfação
  - Uso do plano

### Dashboard Pro
- **Arquivo:** `dashboard-pro.html`
- **Recursos:**
  - Tudo do Básico +
  - Agente de prospecção
  - Leads capturados
  - Taxa de conversão
  - ROI de prospecção
  - Sistema de tabs (Atendimento/Prospecção)

### Dashboard Enterprise
- **Arquivo:** `dashboard-enterprise.html`
- **Recursos:**
  - Tudo do Pro +
  - Analytics avançados
  - Funil de conversão
  - Canais de aquisição
  - Relatórios detalhados
  - Exportação de dados
  - NPS e métricas avançadas

---

## 🔐 Sistema de Segurança

### Proteção de Rotas
- ✅ Todas as páginas verificam autenticação
- ✅ Redirecionamento automático se não logado
- ✅ Controle de acesso por nível de plano
- ✅ Sessão persistente no navegador

### Logout
- Clique no botão "Sair" no canto superior direito
- A sessão é limpa e você retorna ao login

---

## 🎯 Fluxo de Navegação

```
index.html (Splash Screen)
    ↓
login.html (Autenticação)
    ↓
┌─────────────────────────────────────┐
│                                     │
│  Administrador → dashboard-admin    │
│  Básico → dashboard-basic           │
│  Pro → dashboard-pro                │
│  Enterprise → dashboard-enterprise  │
│                                     │
└─────────────────────────────────────┘
```

---

## 💡 Dicas de Uso

### Para Administradores
1. Faça login com `adm@adm.com`
2. Visualize as métricas globais no topo
3. Clique nos cards de planos para alternar entre dashboards
4. Use o iframe para navegar sem perder o contexto

### Para Usuários de Planos
1. Faça login com a conta do seu plano
2. Configure seu assistente na seção de configurações
3. Monitore as métricas em tempo real
4. Use as tabs (Pro/Enterprise) para acessar diferentes funcionalidades

---

## 🛠️ Funcionalidades por Plano

| Funcionalidade | Básico | Pro | Enterprise | Admin |
|----------------|--------|-----|------------|-------|
| Atendimento 24/7 | ✅ | ✅ | ✅ | ✅ |
| Prospecção Ativa | ❌ | ✅ | ✅ | ✅ |
| Analytics Avançados | ❌ | ❌ | ✅ | ✅ |
| Múltiplos Dashboards | ❌ | ❌ | ❌ | ✅ |
| Conversas/mês | 1.000 | 5.000 | Ilimitado | Ilimitado |
| Integrações | 2 | 3 | Todas | Todas |
| Suporte | Email | Chat+Email | Dedicado 24/7 | Prioritário |

---

## 📱 Responsividade

Todos os dashboards são responsivos e funcionam em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

---

## 🔄 Atualizações em Tempo Real

Os dashboards simulam atualizações em tempo real:
- Conversas são incrementadas automaticamente
- Métricas são atualizadas periodicamente
- Animações suaves nas transições

---

## ❓ Problemas Comuns

### Não consigo fazer login
- Verifique se está usando o email correto
- Senha padrão para todas as contas: `1234`
- Limpe o cache do navegador se necessário

### Página fica carregando
- Verifique se todos os arquivos HTML estão na pasta `public/`
- Abra o console do navegador (F12) para ver erros
- Tente limpar o localStorage: `localStorage.clear()`

### Redirecionamento não funciona
- Certifique-se de que está abrindo os arquivos via servidor HTTP
- Ou abra diretamente pelo navegador (file://)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Consulte o `README-LOGIN.md`
3. Abra o console do navegador para debug

---

## 🎉 Pronto para Começar!

Abra `index.html` ou `login.html` e faça login com:
```
Email: adm@adm.com
Senha: 1234
```

Explore todos os dashboards e funcionalidades! 🚀
