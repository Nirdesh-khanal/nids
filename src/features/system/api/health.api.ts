import { apiClient } from '@/lib/axios';
import { healthResponseSchema } from '../schemas/health.schema';
import type { HealthResponse } from '../schemas/health.schema';

export const fetchHealthStatus = async (_forceReal = false): Promise<HealthResponse> => {
  const response = await apiClient.get<unknown>('/health/');
  return healthResponseSchema.parse(response.data);
};
