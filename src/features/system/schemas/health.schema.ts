import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.string(),
  service: z.string().optional().default('NIDS API'),
  database: z.string().optional().default('unknown'),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
