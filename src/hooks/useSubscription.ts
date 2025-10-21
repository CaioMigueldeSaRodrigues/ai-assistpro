import { useMutation } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useSubscription() {
  return useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      toast({
        title: 'Assinatura realizada!',
        description: 'Entraremos em contato em breve.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao processar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
