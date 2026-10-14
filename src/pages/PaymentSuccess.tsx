import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { paymentApi } from '@/lib/api';

type Order = {
  id: number;
  plan: string;
  amount: string;
  payment_method: string;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  created_at: string;
};

export default function PaymentSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    paymentApi.getOrder(orderId).then((data) => setOrder(data as Order)).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Consultando pedido...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1><Button onClick={() => navigate('/dashboard')}>Voltar ao dashboard</Button></div></div>;

  const approved = order.status === 'approved';
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          {approved ? <CheckCircle className="h-16 w-16 text-success mx-auto" /> : <Clock3 className="h-16 w-16 text-orange-500 mx-auto" />}
          <CardTitle>{approved ? 'Pagamento aprovado no sandbox' : `Pedido ${order.status}`}</CardTitle>
          <Badge variant={approved ? 'default' : 'secondary'} className="mx-auto">{order.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Pedido</span><p className="font-mono">#{order.id}</p></div>
            <div><span className="text-muted-foreground">Plano</span><p>{order.plan}</p></div>
            <div><span className="text-muted-foreground">Método</span><p>{order.payment_method}</p></div>
            <div><span className="text-muted-foreground">Valor</span><p>R$ {Number(order.amount).toLocaleString('pt-BR')}</p></div>
          </div>
          <p className="text-sm text-muted-foreground">Este é um resultado do adapter MOCK_SANDBOX. Nenhuma cobrança real foi feita.</p>
          <Button className="w-full" onClick={() => navigate('/dashboard')}>Ir para o dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}
