import { useQuery } from '@tanstack/react-query';
import { fetchTrafficRecords } from '../api/traffic.api';
import { TrafficFilter, PaginatedTrafficResponse } from '../types/traffic.types';
import { useAppStore } from '@/stores/useAppStore';

export const TRAFFIC_QUERY_KEY = ['traffic', 'list'] as const;

export const useTraffic = (filter: TrafficFilter) => {
  const useMockData = useAppStore((state) => state.useMockData);

  return useQuery<PaginatedTrafficResponse, Error>({
    queryKey: [...TRAFFIC_QUERY_KEY, filter, { mock: useMockData }],
    queryFn: () => fetchTrafficRecords(filter, useMockData),
    refetchInterval: 10000, // Refresh traffic stream every 10s
  });
};
