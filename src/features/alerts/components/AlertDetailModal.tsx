import React from 'react';
import { SecurityAlert, AlertStatus } from '../types/alerts.types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { CheckCircle2, Eye, Wrench } from 'lucide-react';

interface AlertDetailModalProps {
  alert: SecurityAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (alertId: string, nextStatus: AlertStatus) => void;
  isUpdating?: boolean;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating = false,
}) => {
  if (!alert) return null;

  const formattedDate = (() => {
    try {
      return format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return alert.timestamp;
    }
  })();

  const severityVariant =
    alert.severity === 'CRITICAL'
      ? 'critical'
      : alert.severity === 'HIGH'
      ? 'high'
      : alert.severity === 'MEDIUM'
      ? 'medium'
      : 'low';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Incident Detail: {alert.id}</span>
          <Badge variant={severityVariant}>{alert.severity}</Badge>
        </div>
      }
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {alert.status === 'NEW' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(alert.id, 'ACKNOWLEDGED')}
                isLoading={isUpdating}
                leftIcon={<Eye size={14} />}
              >
                Acknowledge Alert
              </Button>
            )}
            {alert.status !== 'RESOLVED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusChange(alert.id, 'RESOLVED')}
                isLoading={isUpdating}
                leftIcon={<CheckCircle2 size={14} />}
              >
                Mark Resolved
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Title & Status Header */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-bg-surface-muted)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {alert.title}
            </h3>
            <Badge variant="neutral">Status: {alert.status}</Badge>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span>Signature: <strong>{alert.signatureId}</strong></span>
            <span>Engine: <strong>{alert.detectionEngine}</strong></span>
            <span>Occurrences: <strong>{alert.occurrences}</strong></span>
          </div>
        </div>

        {/* Network Vector Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>SOURCE HOST</span>
            <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9375rem', marginTop: '2px' }}>
              {alert.sourceIp} : {alert.sourcePort}
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>DESTINATION HOST</span>
            <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9375rem', marginTop: '2px' }}>
              {alert.destinationIp} : {alert.destinationPort}
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>FIRST SEEN TIMESTAMP</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', marginTop: '2px' }}>
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Threat Description & Behavior
          </span>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-bg-input)',
              border: '1px solid var(--color-border-default)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            {alert.description}
          </div>
        </div>

        {/* Recommended Mitigation */}
        {alert.mitigation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent-cyan)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={14} /> Recommended SOC Mitigation
            </span>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-accent-cyan-subtle)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'var(--color-text-primary)',
              }}
            >
              {alert.mitigation}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
