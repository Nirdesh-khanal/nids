import { z } from 'zod';

export const dashboardMetricsSchema = z.object({
  totalPacketsAnalyzed: z.number(),
  totalTrafficRecords: z.number(),
  suspiciousEvents: z.number(),
  criticalAlerts: z.number(),
  highAlerts: z.number(),
  activeRulesCount: z.number(),
  packetsPerSecond: z.number().optional().default(0),
});

export const trafficDataPointSchema = z.object({
  timestamp: z.string(),
  timeLabel: z.string(),
  totalPackets: z.number(),
  normalPackets: z.number(),
  anomalousPackets: z.number(),
});

export const protocolStatSchema = z.object({
  protocol: z.string(),
  count: z.number(),
  percentage: z.number(),
  bytes: z.number(),
});

export const topSourceIpSchema = z.object({
  ip: z.string(),
  country: z.string().optional().default('Internal / Local'),
  packetCount: z.number(),
  threatScore: z.number(), // 0-100
  isSuspicious: z.boolean(),
});

export const topPortSchema = z.object({
  port: z.number(),
  serviceName: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export const dashboardSummarySchema = z.object({
  metrics: dashboardMetricsSchema,
  trafficActivity: z.array(trafficDataPointSchema),
  protocolDistribution: z.array(protocolStatSchema),
  topSourceIps: z.array(topSourceIpSchema),
  topDestinationPorts: z.array(topPortSchema),
  isDemoData: z.boolean().default(true),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
export type TrafficDataPoint = z.infer<typeof trafficDataPointSchema>;
export type ProtocolStat = z.infer<typeof protocolStatSchema>;
export type TopSourceIp = z.infer<typeof topSourceIpSchema>;
export type TopPort = z.infer<typeof topPortSchema>;
