import { useState, useEffect } from "react";
import { QrCode, Copy, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface PIXPaymentProps {
  onPayment: (data: any) => void;
  amount: number;
  isLoading: boolean;
}

export function PIXPayment({ onPayment, amount, isLoading }: PIXPaymentProps) {
  const [pixData, setPixData] = useState<{
    qrCode: string;
    pixKey: string;
    expiresAt: Date;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  useEffect(() => {
    // Simular geração do PIX
    const generatePIX = () => {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      setPixData({
        qrCode: `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2)}520400005303986540${amount.toFixed(2)}5802BR5925AI AGENTS PLATFORM LTDA6009SAO PAULO62070503***6304`,
        pixKey: `pix-${Math.random().toString(36).substring(2)}@aiagents.com.br`,
        expiresAt
      });
      setTimeLeft(15 * 60); // 15 minutos em segundos
    };

    generatePIX();
  }, [amount]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência",
    });
  };

  const handleGeneratePIX = () => {
    if (!pixData) return;
    
    onPayment({
      pixKey: pixData.pixKey,
      qrCode: pixData.qrCode,
      type: 'pix'
    });
    
    setPaymentStatus('processing');
    
    // Simular verificação de pagamento
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 3000);
  };

  if (!pixData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <Card className="border-success">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Pagamento Confirmado!</h3>
          <p className="text-muted-foreground mb-4">
            Seu pagamento PIX foi processado com sucesso.
          </p>
          <Badge variant="secondary" className="bg-success/10 text-success">
            Transação Aprovada
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-orange-500" />
        <span>Expira em: </span>
        <Badge variant="outline" className="font-mono">
          {formatTime(timeLeft)}
        </Badge>
      </div>

      {/* QR Code */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <QrCode className="h-32 w-32 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Escaneie o QR Code com o app do seu banco
          </p>
          <div className="text-2xl font-bold text-primary mb-2">
            R$ {amount.toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      {/* PIX Key */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium">Chave PIX:</Label>
              <div className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">
                {pixData.pixKey}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(pixData.pixKey)}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Copy Code */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium">Código PIX:</Label>
              <div className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all max-h-20 overflow-y-auto">
                {pixData.qrCode}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(pixData.qrCode)}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Como pagar com PIX:</h4>
        <ol className="text-sm space-y-1 text-muted-foreground">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escolha a opção PIX</li>
          <li>3. Escaneie o QR Code ou cole o código</li>
          <li>4. Confirme o pagamento</li>
          <li>5. Pronto! O pagamento é instantâneo</li>
        </ol>
      </div>

      {/* Generate PIX Button */}
      <Button
        onClick={handleGeneratePIX}
        className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        disabled={isLoading || paymentStatus === 'processing'}
      >
        {paymentStatus === 'processing' ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Aguardando pagamento...
          </div>
        ) : (
          'Confirmar Pagamento PIX'
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-xs text-center text-muted-foreground">
        <p>PIX é um meio de pagamento instantâneo do Banco Central do Brasil</p>
        <p>Disponível 24h por dia, todos os dias da semana</p>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}