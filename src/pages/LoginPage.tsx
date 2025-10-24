import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  password: string;
  plan: 'basic' | 'pro' | 'enterprise' | 'admin';
  name: string;
  dashboard: string;
}

const users: Record<string, User> = {
  'adm@adm.com': {
    password: '1234',
    plan: 'admin',
    name: 'Administrador',
    dashboard: '/dashboard-admin'
  },
  'basico@demo.com': {
    password: '1234',
    plan: 'basic',
    name: 'Usuário Básico',
    dashboard: '/dashboard-basic'
  },
  'pro@demo.com': {
    password: '1234',
    plan: 'pro',
    name: 'Usuário Pro',
    dashboard: '/dashboard-pro'
  },
  'enterprise@demo.com': {
    password: '1234',
    plan: 'enterprise',
    name: 'Usuário Enterprise',
    dashboard: '/dashboard-enterprise'
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = users[email];
    
    if (!user) {
      setError('Email não encontrado!');
      setLoading(false);
      return;
    }
    
    if (user.password !== password) {
      setError('Senha incorreta!');
      setLoading(false);
      return;
    }
    
    // Salvar sessão no localStorage
    localStorage.setItem('userSession', JSON.stringify({
      email: email,
      name: user.name,
      plan: user.plan,
      loginTime: new Date().toISOString()
    }));
    
    // Redirecionar para o dashboard HTML correspondente
    window.location.href = user.dashboard + '.html';
  };

  const fillLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('1234');
  };

  const getPlanInfo = (plan: string) => {
    const plans = {
      admin: { icon: '👑', name: 'Administrador', color: 'bg-red-500', description: 'Acesso total a todos os planos' },
      basic: { icon: '💼', name: 'Plano Básico', color: 'bg-blue-500', description: 'Atendimento 24/7' },
      pro: { icon: '🚀', name: 'Plano Pro', color: 'bg-purple-500', description: 'Atendimento + Prospecção' },
      enterprise: { icon: '⭐', name: 'Plano Enterprise', color: 'bg-orange-500', description: 'Analytics Avançados' }
    };
    return plans[plan as keyof typeof plans];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Faça login para acessar seu dashboard</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Contas de Demonstração</CardTitle>
            <CardDescription>
              Clique em uma conta para preencher automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(users).map(([email, user]) => {
              const planInfo = getPlanInfo(user.plan);
              return (
                <div
                  key={email}
                  onClick={() => fillLogin(email)}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{planInfo.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{planInfo.name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                      </div>
                    </div>
                    <Badge className={`${planInfo.color} text-white text-xs`}>
                      1234
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-8">
                    {planInfo.description}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;