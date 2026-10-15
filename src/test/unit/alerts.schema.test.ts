import { describe, it, expect } from 'vitest';
import { securityAlertSchema, alertSeveritySchema } from '@/features/alerts/schemas/alerts.schema';

describe('securityAlertSchema', () => {
  it('validates a valid critical intrusion alert', () => {
    const rawAlert = {
      id: 'ALT-1092',
      title: 'High-Volume TCP SYN Flood Attack',
      signatureId: 'ET-DOS-200192',
      severity: 'CRITICAL',
      status: 'NEW',
      sourceIp: '192.168.1.105',
      sourcePort: 49812,
      destinationIp: '192.168.1.1',
      destinationPort: 80,
      protocol: 'TCP',
      timestamp: '2026-10-14T10:45:12.000Z',
      description: 'SYN flood attack detected against gateway.',
      mitigation: 'Block IP on edge firewall.',
      occurrences: 489,
      detectionEngine: 'Snort Rule Engine v3.1',
    };

    const result = securityAlertSchema.safeParse(rawAlert);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.severity).toBe('CRITICAL');
      expect(result.data.status).toBe('NEW');
    }
  });

  it('rejects invalid alert severity values', () => {
    const invalidSeverity = alertSeveritySchema.safeParse('URGENT');
    expect(invalidSeverity.success).toBe(false);

    const validSeverity = alertSeveritySchema.safeParse('HIGH');
    expect(validSeverity.success).toBe(true);
  });
});
