import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useContact() {
  return useMutation({
    mutationFn: contactApi.submit,
    onSuccess: () => {
      toast({
        title: 'Mensagem enviada!',
        description: 'Responderemos em breve.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
