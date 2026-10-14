import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useBotConfig() {
  return useQuery({
    queryKey: ['bot-config'],
    queryFn: botApi.getConfig,
  });
}

export function useSaveBotConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: unknown) => botApi.saveConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-config'] });
      toast({
        title: 'Configurações salvas!',
        description: 'Seu assistente virtual foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useTestBot() {
  return useMutation({
    mutationFn: (message: string) => botApi.testBot(message),
    onError: (error: Error) => {
      toast({
        title: 'Erro ao testar bot',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useBotAnalytics(days: number = 7) {
  return useQuery({
    queryKey: ['bot-analytics', days],
    queryFn: () => botApi.getAnalytics(days),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
