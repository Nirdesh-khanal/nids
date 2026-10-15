import { describe, it, expect } from 'vitest';
import { fetchHealthStatus } from '@/features/system/api/health.api';
import { fetchTrafficRecords } from '@/features/traffic/api/traffic.api';
import { fetchAlerts, updateAlertStatus } from '@/features/alerts/api/alerts.api';

describe('MSW Network API Integration', () => {
  it('successfully fetches and validates Django health response via MSW', async () => {
    const health = await fetchHealthStatus(true);
    expect(health.status).toBe('ok');
    expect(health.service).toContain('NIDS API');
    expect(health.database).toContain('PostgreSQL');
  });

  it('successfully fetches and validates paginated traffic from API endpoint via MSW', async () => {
    const response = await fetchTrafficRecords(
      {
        page: 1,
        pageSize: 10,
        search: '',
        protocol: 'ALL',
        classification: 'ALL',
        sortBy: 'timestamp',
        sortOrder: 'desc',
      },
      false
    );

    expect(response.results.length).toBeGreaterThan(0);
    expect(response.totalCount).toBeGreaterThan(0);
  });

  it('successfully fetches and validates alerts from API endpoint via MSW', async () => {
    const alerts = await fetchAlerts(
      {
        page: 1,
        pageSize: 10,
        search: '',
        severity: 'ALL',
        status: 'ALL',
        sortBy: 'timestamp',
        sortOrder: 'desc',
      },
      false
    );

    expect(alerts.results.length).toBeGreaterThan(0);
  });

  it('successfully patches alert status via MSW', async () => {
    const updated = await updateAlertStatus(
      {
        alertId: 'ALT-1092',
        status: 'RESOLVED',
      },
      false
    );

    expect(updated.id).toBe('ALT-1092');
    expect(updated.status).toBe('RESOLVED');
  });
});
