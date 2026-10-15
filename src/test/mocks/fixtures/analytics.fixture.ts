import { AnalyticsSummary } from '@/features/analytics/types/analytics.types';

export const mockAnalyticsSummary: AnalyticsSummary = {
  timeRange: '24h',
  totalIncidentsInWindow: 342,
  peakPps: 2840,
  meanResolutionTimeMinutes: 14.5,
  isDemoData: true,
  trafficTrends: [
    { time: '00:00', totalPackets: 42000, megabytes: 124, critical: 1, high: 2, medium: 5, low: 8 },
    { time: '03:00', totalPackets: 31000, megabytes: 92, critical: 0, high: 1, medium: 2, low: 4 },
    { time: '06:00', totalPackets: 58000, megabytes: 180, critical: 2, high: 4, medium: 8, low: 12 },
    { time: '09:00', totalPackets: 185000, megabytes: 640, critical: 4, high: 12, medium: 22, low: 30 },
    { time: '12:00', totalPackets: 210000, megabytes: 780, critical: 5, high: 14, medium: 28, low: 35 },
    { time: '15:00', totalPackets: 198000, megabytes: 710, critical: 2, high: 8, medium: 19, low: 26 },
    { time: '18:00', totalPackets: 142000, megabytes: 490, critical: 1, high: 5, medium: 14, low: 18 },
    { time: '21:00', totalPackets: 89000, megabytes: 280, critical: 1, high: 3, medium: 9, low: 11 },
  ],
  severityDistribution: [
    { severity: 'CRITICAL', count: 14, color: '#ef4444' },
    { severity: 'HIGH', count: 38, color: '#f97316' },
    { severity: 'MEDIUM', count: 98, color: '#eab308' },
    { severity: 'LOW', count: 192, color: '#38bdf8' },
  ],
};
