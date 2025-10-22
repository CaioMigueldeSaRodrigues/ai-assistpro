import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useBotConfig(userId: string = 'demo-user') {
  return useQuery({
    queryKey: ['bot-config', userId],
    queryFn: () => botApi.getConfig(userId),
  });
}

export function useSaveBotConfig(userId: string = 'demo-user') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: any) => botApi.saveConfig(userId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-config', userId] });
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

export function useTestBot(userId: string = 'demo-user') {
  return useMutation({
    mutationFn: (message: string) => botApi.testBot(userId, message),
    onError: (error: Error) => {
      toast({
        title: 'Erro ao testar bot',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useBotAnalytics(userId: string = 'demo-user', days: number = 7) {
  return useQuery({
    queryKey: ['bot-analytics', userId, days],
    queryFn: () => botApi.getAnalytics(userId, days),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}