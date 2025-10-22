import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function usePayment() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: paymentApi.processPayment,
    onSuccess: (data) => {
      toast({
        title: 'Pagamento processado!',
        description: 'Redirecionando para confirmação...',
      });
      
      // Redirecionar para página de sucesso
      navigate(`/payment-success/${data.orderId}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no pagamento',
        description: error.message || 'Tente novamente em alguns instantes',
        variant: 'destructive',
      });
    },
  });
}