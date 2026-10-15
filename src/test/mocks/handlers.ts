import { http, HttpResponse } from 'msw';
import { mockDashboardData } from './fixtures/dashboard.fixture';
import { mockTrafficRecords } from './fixtures/traffic.fixture';
import { mockAlertRecords } from './fixtures/alerts.fixture';
import { mockDetectionOverview } from './fixtures/detection.fixture';
import { mockAnalyticsSummary } from './fixtures/analytics.fixture';

const API_BASE = 'http://127.0.0.1:8000/api';

export const handlers = [
  // Health probe
  http.get(`${API_BASE}/health/`, () => {
    return HttpResponse.json({
      status: 'ok',
      service: 'NIDS API (MSW Mocked)',
      database: 'connected (PostgreSQL)',
    });
  }),

  // Dashboard summary
  http.get(`${API_BASE}/dashboard/summary/`, () => {
    return HttpResponse.json(mockDashboardData);
  }),

  // Traffic records
  http.get(`${API_BASE}/traffic/`, () => {
    return HttpResponse.json({
      results: mockTrafficRecords.slice(0, 10),
      totalCount: mockTrafficRecords.length,
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil(mockTrafficRecords.length / 10),
      isDemoData: true,
    });
  }),

  // Alerts records
  http.get(`${API_BASE}/alerts/`, () => {
    return HttpResponse.json({
      results: mockAlertRecords.slice(0, 10),
      totalCount: mockAlertRecords.length,
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil(mockAlertRecords.length / 10),
      isDemoData: true,
    });
  }),

  // Patch alert status
  http.patch(`${API_BASE}/alerts/:id/`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { status: string };
    const alert = mockAlertRecords.find((a) => a.id === id) || mockAlertRecords[0];
    return HttpResponse.json({
      ...alert,
      status: body.status || 'RESOLVED',
    });
  }),

  // Detection overview
  http.get(`${API_BASE}/detection/overview/`, () => {
    return HttpResponse.json(mockDetectionOverview);
  }),

  // Analytics summary
  http.get(`${API_BASE}/analytics/summary/`, () => {
    return HttpResponse.json(mockAnalyticsSummary);
  }),
];
