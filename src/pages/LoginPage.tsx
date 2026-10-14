import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Loader2 } from 'lucide-react';
import { authApi, ApiError } from '@/lib/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') await authApi.register({ name, email, password });
      else await authApi.login({ email, password });
      navigate('/dashboard');
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Não foi possível concluir a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle>{mode === 'login' ? 'Entrar' : 'Criar conta'}</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Acesse seu painel e sua configuração persistida.' : 'Crie uma conta para testar o MVP.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert className="mb-4 border-destructive/50 text-destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div>}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Registrar'}
            </Button>
          </form>
          <Button variant="link" className="w-full mt-3" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Ainda não tenho conta' : 'Já tenho uma conta'}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>Voltar para o início</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
