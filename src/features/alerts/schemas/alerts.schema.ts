import { z } from 'zod';

export const alertSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const alertStatusSchema = z.enum(['NEW', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED']);

export const securityAlertSchema = z.object({
  id: z.string(),
  title: z.string(),
  signatureId: z.string(),
  severity: alertSeveritySchema,
  status: alertStatusSchema,
  sourceIp: z.string(),
  sourcePort: z.number().optional().default(0),
  destinationIp: z.string(),
  destinationPort: z.number().optional().default(0),
  protocol: z.string(),
  timestamp: z.string(),
  description: z.string().optional().default(''),
  mitigation: z.string().optional().default(''),
  occurrences: z.number().default(1),
  detectionEngine: z.string().default('Signature Match'),
});

export const alertFilterSchema = z.object({
  search: z.string().optional().default(''),
  severity: z.string().optional().default('ALL'),
  status: z.string().optional().default('ALL'),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(5).max(100).default(10),
  sortBy: z.string().optional().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const paginatedAlertsResponseSchema = z.object({
  results: z.array(securityAlertSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  isDemoData: z.boolean().default(true),
});

export const updateAlertStatusSchema = z.object({
  alertId: z.string(),
  status: alertStatusSchema,
  note: z.string().optional(),
});

export type SecurityAlert = z.infer<typeof securityAlertSchema>;
export type AlertSeverity = z.infer<typeof alertSeveritySchema>;
export type AlertStatus = z.infer<typeof alertStatusSchema>;
export type AlertFilter = z.infer<typeof alertFilterSchema>;
export type PaginatedAlertsResponse = z.infer<typeof paginatedAlertsResponseSchema>;
export type UpdateAlertStatusPayload = z.infer<typeof updateAlertStatusSchema>;
