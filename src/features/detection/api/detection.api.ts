import { apiClient } from '@/lib/axios';
import { detectionOverviewSchema } from '../schemas/detection.schema';
import type { DetectionOverview } from '../schemas/detection.schema';
import { mockDetectionOverview } from '@/test/mocks/fixtures/detection.fixture';

export const fetchDetectionOverview = async (isMock = false): Promise<DetectionOverview> => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mockDetectionOverview;
  }

  // Contract: GET /api/detection/overview/
  const response = await apiClient.get<unknown>('/detection/overview/');
  return detectionOverviewSchema.parse(response.data);
};
