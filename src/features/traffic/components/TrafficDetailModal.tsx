import React from 'react';
import type { TrafficRecord } from '../types/traffic.types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface TrafficDetailModalProps {
  record: TrafficRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrafficDetailModal: React.FC<TrafficDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record) return null;

  const formattedDate = (() => {
    try {
      return format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS');
    } catch {
      return record.timestamp;
    }
  })();

  const classificationVariant =
    record.classification === 'MALICIOUS'
      ? 'critical'
      : record.classification === 'SUSPICIOUS' || record.classification === 'ANOMALOUS'
      ? 'high'
      : 'info';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Session Inspection: {record.id}</span>
          <Badge variant={classificationVariant}>{record.classification}</Badge>
        </div>
      }
      size="lg"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Inspection
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Flow visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: 'var(--color-bg-surface-muted)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Source Endpoint
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
              {record.sourceIp}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', fontFamily: 'monospace' }}>
              Port: {record.sourcePort}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Badge variant="neutral">{record.protocol}</Badge>
            <ArrowRight size={20} style={{ color: 'var(--color-text-muted)' }} />
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              {record.packetLength} bytes
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Destination Endpoint
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
              {record.destinationIp}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-cyan)', fontFamily: 'monospace' }}>
              Port: {record.destinationPort}
            </span>
          </div>
        </div>

        {/* Technical Attributes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>CAPTURED TIMESTAMP</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', marginTop: '2px' }}>{formattedDate}</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>TCP FLAGS</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', marginTop: '2px' }}>{record.flags || 'None'}</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>TTL (TIME TO LIVE)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', marginTop: '2px' }}>{record.ttl} hops</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>FLOW DURATION</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', marginTop: '2px' }}>{record.flowDurationMs} ms</div>
          </div>
        </div>

        {/* Deep Packet / Summary Inspection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Payload Heuristic / Detection Analysis
          </span>
          <div
            style={{
              padding: '14px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-bg-input)',
              border: '1px solid var(--color-border-default)',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.6,
            }}
          >
            {record.payloadSummary || 'No ASCII payload string decoded in frame header.'}
          </div>
        </div>
      </div>
    </Modal>
  );
};
