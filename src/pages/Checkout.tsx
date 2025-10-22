import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, QrCode, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { usePayment } from "@/hooks/usePayment";
import { PaymentMethod } from "@/components/PaymentMethod";
import { PIXPayment } from "@/components/PIXPayment";

const plans = {
  basic: {
    name: "Básico",
    price: 297,
    features: [
      "Agente de IA Assistente de Atendimento",
      "Disponível 24 horas por dia, 7 dias por semana",
      "Respostas instantâneas",
      "Integração WhatsApp, site e redes sociais",
      "Até 1.000 conversas/mês",
      "Suporte por email",
      "Treinamento básico do agente"
    ]
  },
  pro: {
    name: "Pro",
    price: 697,
    popular: true,
    features: [
      "Tudo do Básico +",
      "Agente de IA Ativo para Prospecção",
      "Busca automática de leads qualificados",
      "Abordagem inteligente e personalizada",
      "Geração de oportunidades 24/7",
      "Até 5.000 conversas/mês",
      "Relatórios semanais de prospecção",
      "Suporte prioritário (chat + email)",
      "Integração com CRM (HubSpot, Pipedrive)"
    ]
  },
  enterprise: {
    name: "Enterprise",
    price: 1497,
    features: [
      "Tudo do Pro +",
      "Dashboard Avançado de KPIs",
      "Métricas em tempo real",
      "Taxa de conversão",
      "Tempo médio de resposta",
      "NPS e satisfação do cliente",
      "ROI de prospecção",
      "Conversas ilimitadas",
      "Gerente de sucesso dedicado",
      "API completa para integrações",
      "Treinamento customizado",
      "SLA de 99.9% de uptime",
      "Suporte 24/7 (phone + chat + email)"
    ]
  }
};

export default function Checkout() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    company: ''
  });

  const plan = plans[planId as keyof typeof plans];
  const payment = usePayment();

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plano não encontrado</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async (paymentData: any) => {
    const orderData = {
      plan: planId,
      customer: customerData,
      payment: {
        method: paymentMethod,
        ...paymentData
      },
      amount: plan.price
    };

    await payment.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            <span className="text-sm text-muted-foreground">Pagamento 100% seguro</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Plano {plan.name}
                    {'popular' in plan && plan.popular && (
                      <Badge className="bg-gradient-to-r from-primary to-secondary">
                        Mais Popular
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    R$ {plan.price.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-muted-foreground">por mês</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Incluído no plano:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {plan.price.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impostos:</span>
                    <span>Inclusos</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total:</span>
                    <span>R$ {plan.price.toLocaleString('pt-BR')}/mês</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">CPF/CNPJ *</Label>
                    <Input
                      id="document"
                      value={customerData.document}
                      onChange={(e) => handleCustomerDataChange('document', e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Empresa (opcional)</Label>
                  <Input
                    id="company"
                    value={customerData.company}
                    onChange={(e) => handleCustomerDataChange('company', e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('credit')}
                    className="flex items-center gap-2 h-12"
                  >
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </Button>
                  <Button
                    variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('pix')}
                    className="flex items-center gap-2 h-12"
                  >
                    <QrCode className="h-4 w-4" />
                    PIX
                  </Button>
                </div>

                {paymentMethod === 'credit' ? (
                  <PaymentMethod
                    onPayment={handlePayment}
                    amount={plan.price}
                    isLoading={payment.isPending}
                  />
                ) : (
                  <PIXPayment
                    onPayment={handlePayment}
                    amount={plan.price}
                    isLoading={payment.isPending}
                  />
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-success mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Seus dados estão seguros</p>
                  <p className="text-muted-foreground">
                    Utilizamos criptografia SSL de 256 bits e não armazenamos dados do cartão.
                    Processamento via Stripe e Mercado Pago.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}