import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from '@/features/dashboard';
import { TrafficPage } from '@/features/traffic';
import { AlertsPage } from '@/features/alerts';
import { DetectionPage } from '@/features/detection';
import { AnalyticsPage } from '@/features/analytics';
import { SettingsPage } from '@/features/settings';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'traffic',
        element: <TrafficPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'detection',
        element: <DetectionPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
