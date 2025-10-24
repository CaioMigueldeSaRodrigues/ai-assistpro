import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simular diferentes tipos de usuário baseado no email
    let userPlan = 'basic';
    if (formData.email.includes('pro')) userPlan = 'pro';
    if (formData.email.includes('enterprise')) userPlan = 'enterprise';
    if (formData.email.includes('admin')) userPlan = 'admin';

    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo ao painel ${userPlan}`,
    });

    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Entrar na Plataforma</CardTitle>
            <p className="text-muted-foreground">
              Acesse seu painel de controle dos agentes de IA
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="text-center font-medium">Contas de demonstração:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Básico:</strong> basic@demo.com</p>
                <p><strong>Pro:</strong> pro@demo.com</p>
                <p><strong>Enterprise:</strong> enterprise@demo.com</p>
                <p><strong>Admin:</strong> admin@demo.com</p>
                <p className="text-center mt-2">Senha: qualquer</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => navigate('/')}>
                Voltar ao site
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}