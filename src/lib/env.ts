import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://127.0.0.1:8000/api'),
  VITE_USE_MOCK_DATA: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
      return false;
    }),
  VITE_API_TIMEOUT_MS: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string' && val.length > 0) {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 10000 : parsed;
      }
      return 10000;
    }),
  MODE: z.string().optional().default('development'),
  DEV: z.boolean().optional().default(true),
  PROD: z.boolean().optional().default(false),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
  VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables configuration:', parsed.error.format());
  throw new Error('Invalid environment variables configuration');
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
