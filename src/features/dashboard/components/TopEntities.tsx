import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { TopSourceIp, TopPort } from '../types/dashboard.types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TopEntitiesProps {
  topIps: TopSourceIp[];
  topPorts: TopPort[];
}

export const TopEntities: React.FC<TopEntitiesProps> = ({ topIps, topPorts }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* Top Source IPs */}
      <Card>
        <CardHeader
          title="Top Source IP Addresses"
          description="High volume network originators and threat scores"
        />
        <CardContent noPadding>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topIps.map((item, idx) => (
              <div
                key={item.ip}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: idx < topIps.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.isSuspicious ? (
                    <ShieldAlert size={18} style={{ color: 'var(--color-severity-critical)', flexShrink: 0 }} />
                  ) : (
                    <ShieldCheck size={18} style={{ color: 'var(--color-severity-info)', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>
                      {item.ip}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.country}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'monospace' }}>
                      {item.packetCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                      packets
                    </div>
                  </div>
                  <Badge variant={item.threatScore > 75 ? 'critical' : item.threatScore > 40 ? 'high' : 'info'}>
                    Score {item.threatScore}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Target Ports */}
      <Card>
        <CardHeader
          title="Top Destination Ports"
          description="Most targeted destination service ports"
        />
        <CardContent noPadding>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topPorts.map((port, idx) => (
              <div
                key={port.port}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '12px 20px',
                  borderBottom: idx < topPorts.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem' }}>
                      Port {port.port}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--color-bg-surface-hover)',
                        color: 'var(--color-accent-cyan)',
                        fontWeight: 600,
                      }}
                    >
                      {port.serviceName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {port.count.toLocaleString()} pkts
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {port.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--color-bg-surface-hover)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${port.percentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-accent-cyan)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
