import { useQuery } from '@tanstack/react-query';
import { kpiApi } from '@/lib/api';

export function useKPIMetrics() {
  return useQuery({
    queryKey: ['kpi', 'metrics'],
    queryFn: kpiApi.getMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useKPITrends(days: number = 30) {
  return useQuery({
    queryKey: ['kpi', 'trends', days],
    queryFn: () => kpiApi.getTrends(days),
  });
}

export function useKPIPlans() {
  return useQuery({
    queryKey: ['kpi', 'plans'],
    queryFn: kpiApi.getPlans,
  });
}
