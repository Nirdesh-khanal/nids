import { z } from 'zod';

export const analyticsTrendPointSchema = z.object({
  time: z.string(),
  totalPackets: z.number(),
  critical: z.number(),
  high: z.number(),
  medium: z.number(),
  low: z.number(),
  megabytes: z.number(),
});

export const severityShareSchema = z.object({
  severity: z.string(),
  count: z.number(),
  color: z.string(),
});

export const analyticsSummarySchema = z.object({
  timeRange: z.string(),
  trafficTrends: z.array(analyticsTrendPointSchema),
  severityDistribution: z.array(severityShareSchema),
  totalIncidentsInWindow: z.number(),
  peakPps: z.number(),
  meanResolutionTimeMinutes: z.number(),
  isDemoData: z.boolean().default(true),
});

export type AnalyticsTrendPoint = z.infer<typeof analyticsTrendPointSchema>;
export type SeverityShare = z.infer<typeof severityShareSchema>;
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
