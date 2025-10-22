import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular busca dos dados do pedido
    setTimeout(() => {
      setOrderData({
        id: orderId,
        plan: 'Pro',
        amount: 697,
        paymentMethod: 'PIX',
        status: 'approved',
        createdAt: new Date().toISOString(),
        customer: {
          name: 'João Silva',
          email: 'joao@exemplo.com'
        }
      });
      setLoading(false);
    }, 1500);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Confirmando pagamento...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-success/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-success mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-muted-foreground">
              Seu plano foi ativado com sucesso
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Detalhes do Pedido
                  <Badge className="bg-success text-white">
                    Aprovado
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pedido:</span>
                    <p className="font-mono">#{orderData.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data:</span>
                    <p>{new Date(orderData.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plano:</span>
                    <p className="font-semibold">{orderData.plan}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pagamento:</span>
                    <p>{orderData.paymentMethod}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Pago:</span>
                  <span className="text-2xl font-bold text-success">
                    R$ {orderData.amount.toLocaleString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Confirmação por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Enviamos os detalhes da sua assinatura para {orderData.customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Configuração do Agente</p>
                      <p className="text-sm text-muted-foreground">
                        Nossa equipe entrará em contato em até 24h para configurar seu agente de IA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Treinamento e Ativação</p>
                      <p className="text-sm text-muted-foreground">
                        Seu agente será treinado e ativado em até 48h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Baixar Recibo
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Reenviar Email
              </Button>
            </div>

            <Button 
              onClick={() => navigate('/')}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Voltar ao Início
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8 p-4 bg-muted/30 rounded-lg"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Precisa de ajuda?
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="mailto:suporte@aiagents.com.br" className="text-primary hover:underline">
                suporte@aiagents.com.br
              </a>
              <span>•</span>
              <a href="https://wa.me/5511999999999" className="text-primary hover:underline">
                WhatsApp: (11) 99999-9999
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}