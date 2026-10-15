import { z } from 'zod';

export const trafficRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  sourceIp: z.string(),
  sourcePort: z.number(),
  destinationIp: z.string(),
  destinationPort: z.number(),
  protocol: z.enum(['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'OTHER']),
  packetLength: z.number(),
  classification: z.enum(['NORMAL', 'SUSPICIOUS', 'MALICIOUS', 'ANOMALOUS']),
  flags: z.string().optional().default(''),
  ttl: z.number().optional().default(64),
  flowDurationMs: z.number().optional().default(0),
  payloadSummary: z.string().optional().default(''),
});

export const trafficFilterSchema = z.object({
  search: z.string().optional().default(''),
  protocol: z.string().optional().default('ALL'),
  classification: z.string().optional().default('ALL'),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(5).max(100).default(10),
  sortBy: z.string().optional().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const paginatedTrafficResponseSchema = z.object({
  results: z.array(trafficRecordSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  isDemoData: z.boolean().default(true),
});

export type TrafficRecord = z.infer<typeof trafficRecordSchema>;
export type TrafficFilter = z.infer<typeof trafficFilterSchema>;
export type PaginatedTrafficResponse = z.infer<typeof paginatedTrafficResponseSchema>;
