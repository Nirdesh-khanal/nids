import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, updateAlertStatus } from '../api/alerts.api';
import {
  AlertFilter,
  PaginatedAlertsResponse,
  UpdateAlertStatusPayload,
  SecurityAlert,
} from '../types/alerts.types';
import { useAppStore } from '@/stores/useAppStore';

export const ALERTS_QUERY_KEY = ['alerts', 'list'] as const;

export const useAlerts = (filter: AlertFilter) => {
  const useMockData = useAppStore((state) => state.useMockData);

  return useQuery<PaginatedAlertsResponse, Error>({
    queryKey: [...ALERTS_QUERY_KEY, filter, { mock: useMockData }],
    queryFn: () => fetchAlerts(filter, useMockData),
    refetchInterval: 15000,
  });
};

export const useUpdateAlertStatus = () => {
  const queryClient = useQueryClient();
  const useMockData = useAppStore((state) => state.useMockData);

  return useMutation<SecurityAlert, Error, UpdateAlertStatusPayload>({
    mutationFn: (payload) => updateAlertStatus(payload, useMockData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
    },
  });
};
