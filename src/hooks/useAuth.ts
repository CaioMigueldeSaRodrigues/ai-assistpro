import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    user: query.data?.user,
    logout: async () => {
      await authApi.logout();
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  };
}
