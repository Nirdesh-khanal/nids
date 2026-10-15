import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsSummary } from '../api/analytics.api';
import { AnalyticsSummary } from '../types/analytics.types';
import { useAppStore } from '@/stores/useAppStore';

export const ANALYTICS_QUERY_KEY = ['analytics', 'summary'] as const;

export const useAnalytics = (timeRange = '24h') => {
  const useMockData = useAppStore((state) => state.useMockData);

  return useQuery<AnalyticsSummary, Error>({
    queryKey: [...ANALYTICS_QUERY_KEY, timeRange, { mock: useMockData }],
    queryFn: () => fetchAnalyticsSummary(timeRange, useMockData),
    staleTime: 60000,
  });
};
