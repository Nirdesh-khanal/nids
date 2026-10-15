import React, { useState } from 'react';
import {
  Download,
  TrendingUp,
  ShieldAlert,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import styles from './AnalyticsPage.module.scss';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';

export const AnalyticsPage: React.FC = () => {
  const useMockData = useAppStore((state) => state.useMockData);
  const [timeRange, setTimeRange] = useState('24h');

  const { data, isPending, isError, error, refetch, isFetching } = useAnalytics(timeRange);

  const handleExportReport = () => {
    if (!data) return;
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange: data.timeRange,
      totalIncidents: data.totalIncidentsInWindow,
      peakPps: data.peakPps,
      meanResolutionTimeMinutes: data.meanResolutionTimeMinutes,
      severityBreakdown: data.severityDistribution,
      trends: data.trafficTrends,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel_analytics_report_${timeRange}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analytics security summary downloaded (JSON)');
  };

  if (isPending) {
    return (
      <div className={styles.pageContainer}>
        <Skeleton width="280px" height="32px" />
        <Skeleton width="420px" height="18px" />
        <div className={styles.kpiGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="8px" />
          ))}
        </div>
        <div className={styles.chartsGrid}>
          <Skeleton height="360px" borderRadius="8px" />
          <Skeleton height="360px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.pageContainer}>
        <ErrorState
          title="Failed to Load Security Analytics"
          message={error?.message || 'Unable to retrieve telemetry trends from the backend API.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>Security Analytics & Trends</span>
            {useMockData && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Aggregated traffic volume metrics, volumetric attack patterns, and incident severity distributions.
          </p>
        </div>

        <div className={styles.headerActions}>
          <div style={{ width: '150px' }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: '1h', label: 'Last 1 Hour' },
                { value: '24h', label: 'Last 24 Hours' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
              ]}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            leftIcon={<Download size={14} />}
          >
            Export Report
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Incidents In Window"
          value={data.totalIncidentsInWindow}
          icon={<ShieldAlert size={18} />}
          subtext={`Captured across ${timeRange}`}
          isDemo={useMockData}
        />

        <StatCard
          title="Peak Throughput"
          value={`${data.peakPps.toLocaleString()} pps`}
          icon={<TrendingUp size={18} />}
          subtext="Observed during 09:00 burst"
          isDemo={useMockData}
        />

        <StatCard
          title="Mean Time To Resolve"
          value={`${data.meanResolutionTimeMinutes} min`}
          icon={<Clock size={18} />}
          subtext="SecOps analyst incident closure"
          isDemo={useMockData}
        />
      </div>

      {/* Traffic & Bandwidth Trends */}
      <Card>
        <CardHeader
          title="Throughput & Bandwidth Ingestion Trend"
          description="Total packets and megabytes transferred across the analyzed timeline"
        />
        <CardContent>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trafficTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: '6px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.8125rem',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '0.8125rem' }} />
                <Line
                  type="monotone"
                  dataKey="totalPackets"
                  name="Packets Ingested"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="megabytes"
                  name="Data Volume (MB)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stacked Alert Incidents & Severity Breakdown */}
      <div className={styles.chartsGrid}>
        {/* Stacked Bar by Severity */}
        <Card>
          <CardHeader
            title="Incident Detections by Severity Over Time"
            description="Correlation of attack volume classified by risk tiers"
          />
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trafficTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      borderColor: 'var(--chart-tooltip-border)',
                      borderRadius: '6px',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.8125rem',
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '0.8125rem' }} />
                  <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" />
                  <Bar dataKey="high" name="High" stackId="a" fill="#f97316" />
                  <Bar dataKey="medium" name="Medium" stackId="a" fill="#eab308" />
                  <Bar dataKey="low" name="Low" stackId="a" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Severity Distribution Card */}
        <Card>
          <CardHeader
            title="Severity Distribution"
            description="Relative proportion of recorded threats"
          />
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px' }}>
              {data.severityDistribution.map((item) => {
                const total = data.severityDistribution.reduce((acc, curr) => acc + curr.count, 0);
                const percent = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                return (
                  <div key={item.severity} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.severity}</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                        {item.count} incidents ({percent}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'var(--color-bg-surface-hover)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
