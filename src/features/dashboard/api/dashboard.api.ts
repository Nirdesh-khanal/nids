import { apiClient } from '@/lib/axios';
import { dashboardSummarySchema } from '../schemas/dashboard.schema';
import type { DashboardSummary } from '../schemas/dashboard.schema';
import { mockDashboardData } from '@/test/mocks/fixtures/dashboard.fixture';

export const fetchDashboardSummary = async (isMock = false): Promise<DashboardSummary> => {
  if (isMock) {
    // Artificial small latency to simulate network in mock mode
    await new Promise((resolve) => setTimeout(resolve, 350));
    return mockDashboardData;
  }

  // Contract: GET /api/dashboard/summary/
  const response = await apiClient.get<unknown>('/dashboard/summary/');
  return dashboardSummarySchema.parse(response.data);
};
