import { useQuery } from '@tanstack/react-query';
import { fetchHealthStatus } from '../api/health.api';
import { HealthResponse } from '../schemas/health.schema';
import { useAppStore } from '@/stores/useAppStore';

export const HEALTH_QUERY_KEY = ['system', 'health'] as const;

export interface HealthState {
  data: HealthResponse | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | unknown;
  refetch: () => void;
  isFetching: boolean;
  isConnected: boolean;
  databaseStatus: string;
  isMock: boolean;
}

export const useHealth = (): HealthState => {
  const useMockData = useAppStore((state) => state.useMockData);

  const query = useQuery({
    queryKey: [...HEALTH_QUERY_KEY, { mock: useMockData }],
    queryFn: async (): Promise<HealthResponse> => {
      if (useMockData) {
        // Return explicit mock health state
        return {
          status: 'ok',
          service: 'NIDS API (Simulated)',
          database: 'connected (simulated SQLite/PostgreSQL)',
        };
      }
      return await fetchHealthStatus(true);
    },
    refetchInterval: 15000, // Poll health every 15s
    retry: 1,
  });

  const isConnected = !query.isError && query.data?.status === 'ok';
  const databaseStatus = query.data?.database ?? (query.isError ? 'disconnected' : 'checking...');

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isConnected,
    databaseStatus,
    isMock: useMockData,
  };
};
