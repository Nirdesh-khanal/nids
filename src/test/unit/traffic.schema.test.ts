import { describe, it, expect } from 'vitest';
import { trafficRecordSchema, trafficFilterSchema } from '@/features/traffic/schemas/traffic.schema';

describe('trafficRecordSchema', () => {
  it('validates a complete traffic telemetry packet record', () => {
    const rawPacket = {
      id: 'pkt-001',
      timestamp: '2026-10-14T10:45:12.102Z',
      sourceIp: '192.168.1.105',
      sourcePort: 49812,
      destinationIp: '192.168.1.1',
      destinationPort: 80,
      protocol: 'TCP',
      packetLength: 64,
      classification: 'MALICIOUS',
      flags: 'SYN',
      ttl: 128,
      flowDurationMs: 12,
      payloadSummary: 'SYN flood packet',
    };

    const parsed = trafficRecordSchema.safeParse(rawPacket);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.id).toBe('pkt-001');
      expect(parsed.data.protocol).toBe('TCP');
      expect(parsed.data.classification).toBe('MALICIOUS');
    }
  });

  it('applies default values for filter schema', () => {
    const emptyFilter = {};
    const parsed = trafficFilterSchema.parse(emptyFilter);
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(10);
    expect(parsed.protocol).toBe('ALL');
    expect(parsed.classification).toBe('ALL');
    expect(parsed.sortOrder).toBe('desc');
  });
});
