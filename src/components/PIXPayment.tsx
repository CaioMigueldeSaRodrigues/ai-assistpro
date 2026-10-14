import { QrCode, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PIXPaymentProps {
  onPayment: (data: Record<string, never>) => void;
  amount: number;
  isLoading: boolean;
}

export function PIXPayment({ onPayment, amount, isLoading }: PIXPaymentProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
          <h3 className="font-semibold">PIX em sandbox</h3>
          <p className="text-sm text-muted-foreground">
            O pedido será criado no backend e permanecerá pendente até uma confirmação de webhook autenticado.
          </p>
          <p className="text-sm font-medium">R$ {amount.toLocaleString('pt-BR')}</p>
        </CardContent>
      </Card>
      <Button onClick={() => onPayment({})} className="w-full h-12" disabled={isLoading}>
        {isLoading ? 'Criando pedido...' : 'Criar pedido PIX de sandbox'}
      </Button>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-4 w-4" /> Nenhuma confirmação é simulada no navegador.
      </div>
    </div>
  );
}
