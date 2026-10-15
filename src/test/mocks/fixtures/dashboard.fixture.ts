import { DashboardSummary } from '@/features/dashboard/types/dashboard.types';

export const mockDashboardData: DashboardSummary = {
  metrics: {
    totalPacketsAnalyzed: 2841920,
    totalTrafficRecords: 489312,
    suspiciousEvents: 342,
    criticalAlerts: 14,
    highAlerts: 38,
    activeRulesCount: 128,
    packetsPerSecond: 1450,
  },
  trafficActivity: [
    { timestamp: '2026-10-14T04:00:00Z', timeLabel: '04:00', totalPackets: 42000, normalPackets: 41800, anomalousPackets: 200 },
    { timestamp: '2026-10-14T05:00:00Z', timeLabel: '05:00', totalPackets: 58000, normalPackets: 57600, anomalousPackets: 400 },
    { timestamp: '2026-10-14T06:00:00Z', timeLabel: '06:00', totalPackets: 73000, normalPackets: 72100, anomalousPackets: 900 },
    { timestamp: '2026-10-14T07:00:00Z', timeLabel: '07:00', totalPackets: 120000, normalPackets: 116500, anomalousPackets: 3500 },
    { timestamp: '2026-10-14T08:00:00Z', timeLabel: '08:00', totalPackets: 165000, normalPackets: 162200, anomalousPackets: 2800 },
    { timestamp: '2026-10-14T09:00:00Z', timeLabel: '09:00', totalPackets: 210000, normalPackets: 205400, anomalousPackets: 4600 },
    { timestamp: '2026-10-14T10:00:00Z', timeLabel: '10:00', totalPackets: 195000, normalPackets: 191800, anomalousPackets: 3200 },
    { timestamp: '2026-10-14T11:00:00Z', timeLabel: '11:00', totalPackets: 182000, normalPackets: 180100, anomalousPackets: 1900 },
  ],
  protocolDistribution: [
    { protocol: 'TCP', count: 1845000, percentage: 64.9, bytes: 2489201940 },
    { protocol: 'UDP', count: 682000, percentage: 24.0, bytes: 849201940 },
    { protocol: 'ICMP', count: 198000, percentage: 7.0, bytes: 14201940 },
    { protocol: 'HTTP/S', count: 86920, percentage: 3.1, bytes: 948201940 },
    { protocol: 'DNS', count: 30000, percentage: 1.0, bytes: 4201940 },
  ],
  topSourceIps: [
    { ip: '192.168.1.105', country: 'Internal LAN', packetCount: 142850, threatScore: 92, isSuspicious: true },
    { ip: '45.33.32.156', country: 'United States', packetCount: 89400, threatScore: 84, isSuspicious: true },
    { ip: '185.220.101.5', country: 'Germany (Tor Exit)', packetCount: 65120, threatScore: 78, isSuspicious: true },
    { ip: '10.0.0.45', country: 'Internal DMZ', packetCount: 48900, threatScore: 68, isSuspicious: true },
    { ip: '192.168.1.20', country: 'Internal Server', packetCount: 38200, threatScore: 12, isSuspicious: false },
  ],
  topDestinationPorts: [
    { port: 80, serviceName: 'HTTP', count: 984000, percentage: 34.6 },
    { port: 443, serviceName: 'HTTPS', count: 860000, percentage: 30.2 },
    { port: 22, serviceName: 'SSH', count: 320000, percentage: 11.2 },
    { port: 53, serviceName: 'DNS', count: 210000, percentage: 7.4 },
    { port: 3389, serviceName: 'RDP', count: 145000, percentage: 5.1 },
  ],
  isDemoData: true,
};
