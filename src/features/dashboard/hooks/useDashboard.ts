import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../api/dashboard.api';
import { DashboardSummary } from '../types/dashboard.types';
import { useAppStore } from '@/stores/useAppStore';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'summary'] as const;

export const useDashboard = () => {
  const useMockData = useAppStore((state) => state.useMockData);

  return useQuery<DashboardSummary, Error>({
    queryKey: [...DASHBOARD_QUERY_KEY, { mock: useMockData }],
    queryFn: () => fetchDashboardSummary(useMockData),
    refetchInterval: 30000, // Refresh dashboard every 30s
  });
};
