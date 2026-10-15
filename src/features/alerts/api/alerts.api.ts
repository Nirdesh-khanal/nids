import { apiClient } from '@/lib/axios';
import {
  paginatedAlertsResponseSchema,
  securityAlertSchema,
} from '../schemas/alerts.schema';
import type {
  AlertFilter,
  PaginatedAlertsResponse,
  UpdateAlertStatusPayload,
  SecurityAlert,
} from '../schemas/alerts.schema';
import { mockAlertRecords } from '@/test/mocks/fixtures/alerts.fixture';

// In-memory mock store for demo session mutations
const alertsDatabase = [...mockAlertRecords];

export const fetchAlerts = async (
  filter: AlertFilter,
  isMock = false
): Promise<PaginatedAlertsResponse> => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let filtered = [...alertsDatabase];

    // Search query
    if (filter.search && filter.search.trim().length > 0) {
      const q = filter.search.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.sourceIp.toLowerCase().includes(q) ||
          a.destinationIp.toLowerCase().includes(q) ||
          a.signatureId.toLowerCase().includes(q)
      );
    }

    // Severity filter
    if (filter.severity && filter.severity !== 'ALL') {
      filtered = filtered.filter(
        (a) => a.severity.toUpperCase() === filter.severity.toUpperCase()
      );
    }

    // Status filter
    if (filter.status && filter.status !== 'ALL') {
      filtered = filtered.filter(
        (a) => a.status.toUpperCase() === filter.status.toUpperCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filter.sortBy === 'timestamp') {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return filter.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / filter.pageSize));
    const startIdx = (filter.page - 1) * filter.pageSize;
    const paginated = filtered.slice(startIdx, startIdx + filter.pageSize);

    return {
      results: paginated,
      totalCount,
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages,
      isDemoData: true,
    };
  }

  // Contract: GET /api/alerts/
  const response = await apiClient.get<unknown>('/alerts/', {
    params: {
      search: filter.search || undefined,
      severity: filter.severity !== 'ALL' ? filter.severity : undefined,
      status: filter.status !== 'ALL' ? filter.status : undefined,
      page: filter.page,
      page_size: filter.pageSize,
      sort_by: filter.sortBy,
      sort_order: filter.sortOrder,
    },
  });

  return paginatedAlertsResponseSchema.parse(response.data);
};

export const updateAlertStatus = async (
  payload: UpdateAlertStatusPayload,
  isMock = false
): Promise<SecurityAlert> => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const idx = alertsDatabase.findIndex((a) => a.id === payload.alertId);
    if (idx !== -1) {
      alertsDatabase[idx] = {
        ...alertsDatabase[idx],
        status: payload.status,
      };
      return alertsDatabase[idx];
    }
    throw new Error(`Alert with id ${payload.alertId} not found`);
  }

  // Contract: PATCH /api/alerts/:id/
  const response = await apiClient.patch<unknown>(`/alerts/${payload.alertId}/`, {
    status: payload.status,
    note: payload.note,
  });

  return securityAlertSchema.parse(response.data);
};
