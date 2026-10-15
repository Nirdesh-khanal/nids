import { apiClient } from '@/lib/axios';
import { analyticsSummarySchema } from '../schemas/analytics.schema';
import type { AnalyticsSummary } from '../schemas/analytics.schema';
import { mockAnalyticsSummary } from '@/test/mocks/fixtures/analytics.fixture';

export const fetchAnalyticsSummary = async (
  timeRange = '24h',
  isMock = false
): Promise<AnalyticsSummary> => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      ...mockAnalyticsSummary,
      timeRange,
    };
  }

  // Contract: GET /api/analytics/summary/?range=24h
  const response = await apiClient.get<unknown>('/analytics/summary/', {
    params: { range: timeRange },
  });
  return analyticsSummarySchema.parse(response.data);
};
