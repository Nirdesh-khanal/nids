import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { ProtocolStat } from '../types/dashboard.types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

const PROTOCOL_COLORS: Record<string, string> = {
  TCP: '#06b6d4',
  UDP: '#3b82f6',
  ICMP: '#6366f1',
  'HTTP/S': '#10b981',
  DNS: '#f59e0b',
  OTHER: '#94a3b8',
};

interface ProtocolDistributionChartProps {
  data: ProtocolStat[];
}

export const ProtocolDistributionChart: React.FC<ProtocolDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title="Protocol Breakdown" />
        <CardContent>
          <EmptyState title="No protocol data" description="No protocols observed yet." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Protocol Breakdown"
        description="Share of total captured network traffic by protocol"
      />
      <CardContent>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <YAxis
                type="category"
                dataKey="protocol"
                stroke="var(--color-text-primary)"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--chart-tooltip-bg)',
                  borderColor: 'var(--chart-tooltip-border)',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                }}
                formatter={(val) => [`${val}%`, 'Traffic Share']}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.protocol}`}
                    fill={PROTOCOL_COLORS[entry.protocol] || '#06b6d4'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
