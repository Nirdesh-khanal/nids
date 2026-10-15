import { useQuery } from '@tanstack/react-query';
import { fetchDetectionOverview } from '../api/detection.api';
import { DetectionOverview } from '../types/detection.types';
import { useAppStore } from '@/stores/useAppStore';

export const DETECTION_QUERY_KEY = ['detection', 'overview'] as const;

export const useDetection = () => {
  const useMockData = useAppStore((state) => state.useMockData);

  return useQuery<DetectionOverview, Error>({
    queryKey: [...DETECTION_QUERY_KEY, { mock: useMockData }],
    queryFn: () => fetchDetectionOverview(useMockData),
  });
};
