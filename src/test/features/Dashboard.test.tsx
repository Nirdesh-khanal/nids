import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppProviders } from '@/app/providers/AppProviders';
import { DashboardPage } from '@/features/dashboard';

describe('Dashboard Feature', () => {
  it('renders dashboard overview title and telemetry metrics', async () => {
    render(
      <AppProviders>
        <DashboardPage />
      </AppProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('Security Operations Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Packets Analyzed')).toBeInTheDocument();
    expect(screen.getByText('Traffic Records')).toBeInTheDocument();
    expect(screen.getByText('Critical Alerts')).toBeInTheDocument();
  });
});
