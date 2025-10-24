import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Crown, 
  Briefcase, 
  Rocket, 
  Star, 
  BarChart3, 
  Users, 
  Target, 
  Settings,
  ArrowRight,
  LogIn
} from "lucide-react";

const dashboards = [
  {
    id: 'admin',
    icon: Crown,
    title: 'Dashboard Administrativo',
    description: 'Acesso completo a todos os planos e métricas globais',
    features: ['Visualização de todos os planos', 'Métricas consolidadas', 'Controle total'],
    color: 'bg-red-500',
    email: 'adm@adm.com',
    badge: 'Admin'
  },
  {
    id: 'basic',
    icon: Briefcase,
    title: 'Dashboard Básico',
    description: 'Atendimento 24/7 com assistente virtual inteligente',
    features: ['Até 1.000 conversas/mês', 'WhatsApp + Site', 'Suporte por email'],
    color: 'bg-blue-500',
    email: 'basico@demo.com',
    badge: 'Básico'
  },
  {
    id: 'pro',
    icon: Rocket,
    title: 'Dashboard Pro',
    description: 'Atendimento + Prospecção ativa de leads qualificados',
    features: ['Até 5.000 conversas/mês', 'Agente de prospecção', 'Integração CRM'],
    color: 'bg-purple-500',
    email: 'pro@demo.com',
    badge: 'Pro'
  },
  {
    id: 'enterprise',
    icon: Star,
    title: 'Dashboard Enterprise',
    description: 'Analytics avançados e suporte dedicado 24/7',
    features: ['Conversas ilimitadas', 'Analytics avançados', 'Suporte dedicado'],
    color: 'bg-orange-500',
    email: 'enterprise@demo.com',
    badge: 'Enterprise'
  }
];

export const DashboardPreview = () => {
  const navigate = useNavigate();

  const handleDashboardAccess = (email: string) => {
    // Preencher email no localStorage para auto-preenchimento
    localStorage.setItem('prefilledEmail', email);
    navigate('/login');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Dashboards Interativos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Nossos Dashboards
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada plano possui um dashboard personalizado com funcionalidades específicas. 
            Teste agora com nossas contas de demonstração!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            return (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-xl ${dashboard.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex justify-center mb-2">
                      <Badge className={`${dashboard.color} text-white`}>
                        {dashboard.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {dashboard.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {dashboard.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handleDashboardAccess(dashboard.email)}
                      className="w-full group"
                      variant="outline"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Testar Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {dashboard.email} / 1234
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Acesso Rápido</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Todas as contas usam a senha <strong>1234</strong>. 
                Clique em qualquer dashboard acima para fazer login automaticamente!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Página de Login
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDashboardAccess('adm@adm.com')}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Acesso Admin Direto
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};