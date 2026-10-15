import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { TrafficDataPoint } from '../types/dashboard.types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface TrafficOverviewChartProps {
  data: TrafficDataPoint[];
  isDemo?: boolean;
}

export const TrafficOverviewChart: React.FC<TrafficOverviewChartProps> = ({ data, isDemo }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title="Network Activity Over Time" />
        <CardContent>
          <EmptyState title="No traffic activity recorded" description="Telemetry pipeline has not observed packets in this window." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Network Activity & Anomaly Ingestion"
        description="Packets per hour categorized by normal baseline vs detected anomalies"
        actions={isDemo ? <Badge variant="demo">DEMO DATA</Badge> : undefined}
      />
      <CardContent>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
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
                formatter={(val) => [`${Number(val).toLocaleString()} pkts`, 'Volume']}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '0.8125rem' }}
              />
              <Area
                type="monotone"
                dataKey="normalPackets"
                name="Normal Traffic"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNormal)"
              />
              <Area
                type="monotone"
                dataKey="anomalousPackets"
                name="Anomalous Traffic"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAnomaly)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
