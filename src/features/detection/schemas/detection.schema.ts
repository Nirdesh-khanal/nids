import { z } from 'zod';

export const detectionModuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['SIGNATURE', 'BEHAVIORAL', 'STATISTICAL', 'MACHINE_LEARNING', 'THREAT_INTEL']),
  status: z.enum(['ACTIVE', 'PLANNED', 'NOT_CONFIGURED', 'DEGRADED']),
  description: z.string(),
  rulesLoaded: z.number().optional(),
  lastAnalyzed: z.string().optional(),
  benchmarkScore: z.string().optional(),
  backendReady: z.boolean().default(false),
});

export const mlModelStatusSchema = z.object({
  modelName: z.string(),
  architecture: z.string(),
  status: z.enum(['OFFLINE', 'READY', 'TRAINING', 'PLANNED']),
  targetDataset: z.string(),
  benchmarkAccuracy: z.number().optional(),
  benchmarkPrecision: z.number().optional(),
  benchmarkRecall: z.number().optional(),
  benchmarkF1: z.number().optional(),
  trainedOn: z.string().optional(),
  backendIntegrated: z.boolean().default(false),
  notes: z.string(),
});

export const detectionOverviewSchema = z.object({
  engineStatus: z.string(),
  modules: z.array(detectionModuleSchema),
  mlModel: mlModelStatusSchema,
  totalRules: z.number(),
  lastSignatureUpdate: z.string(),
  isDemoData: z.boolean().default(true),
});

export type DetectionModule = z.infer<typeof detectionModuleSchema>;
export type MlModelStatus = z.infer<typeof mlModelStatusSchema>;
export type DetectionOverview = z.infer<typeof detectionOverviewSchema>;
