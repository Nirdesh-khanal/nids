import { describe, it, expect } from 'vitest';
import { healthResponseSchema } from '@/features/system/schemas/health.schema';

describe('healthResponseSchema', () => {
  it('successfully validates standard Django health response', () => {
    const rawPayload = {
      status: 'ok',
      service: 'NIDS API',
      database: 'connected',
    };

    const parsed = healthResponseSchema.safeParse(rawPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe('ok');
      expect(parsed.data.service).toBe('NIDS API');
      expect(parsed.data.database).toBe('connected');
    }
  });

  it('provides default fallback for optional fields', () => {
    const rawPayload = {
      status: 'ok',
    };

    const parsed = healthResponseSchema.safeParse(rawPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.service).toBe('NIDS API');
      expect(parsed.data.database).toBe('unknown');
    }
  });

  it('rejects responses missing required status field', () => {
    const invalidPayload = {
      database: 'connected',
    };

    const parsed = healthResponseSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });
});
