import React from 'react';
import {
  ShieldAlert,
  Radio,
  FileText,
  AlertTriangle,
  Server,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import styles from './DashboardPage.module.scss';
import { useDashboard } from '../hooks/useDashboard';
import { useHealth } from '@/features/system/hooks/useHealth';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { TrafficOverviewChart } from '../components/TrafficOverviewChart';
import { ProtocolDistributionChart } from '../components/ProtocolDistributionChart';
import { TopEntities } from '../components/TopEntities';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useDashboard();
  const { isConnected, databaseStatus, isMock } = useHealth();

  const handleManualRefresh = () => {
    refetch();
    toast.success('Dashboard metrics refreshed');
  };

  if (isPending) {
    return (
      <div className={styles.pageContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Skeleton width="240px" height="32px" />
            <Skeleton width="340px" height="18px" style={{ marginTop: '8px' }} />
          </div>
          <Skeleton width="120px" height="36px" />
        </div>

        <div className={styles.statsGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="8px" />
          ))}
        </div>

        <div className={styles.chartsGrid}>
          <Skeleton height="380px" borderRadius="8px" />
          <Skeleton height="380px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.pageContainer}>
        <ErrorState
          title="Failed to Load Dashboard Metrics"
          message={error?.message || 'Unable to retrieve telemetry summary from the NIDS backend API.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { metrics, trafficActivity, protocolDistribution, topSourceIps, topDestinationPorts } = data;

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>Security Operations Dashboard</span>
            {isMock && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Real-time network traffic ingestion, protocol breakdown, and active intrusion detections.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            isLoading={isFetching}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Packets Analyzed"
          value={metrics.totalPacketsAnalyzed.toLocaleString()}
          icon={<Radio size={18} />}
          subtext={
            <span>
              <strong>{metrics.packetsPerSecond.toLocaleString()}</strong> pkts/sec ingestion rate
            </span>
          }
          isDemo={isMock}
        />

        <StatCard
          title="Traffic Records"
          value={metrics.totalTrafficRecords.toLocaleString()}
          icon={<FileText size={18} />}
          subtext="Indexed session streams"
          isDemo={isMock}
        />

        <StatCard
          title="Suspicious Events"
          value={metrics.suspiciousEvents.toLocaleString()}
          icon={<AlertTriangle size={18} />}
          subtext="Signature & anomaly flags"
          isDemo={isMock}
          trend={{ value: '+4.2% today', isPositive: false }}
        />

        <StatCard
          title="Critical Alerts"
          value={metrics.criticalAlerts}
          icon={<ShieldAlert size={18} />}
          subtext="Immediate action required"
          isDemo={isMock}
        />

        <StatCard
          title="Active Detection Rules"
          value={metrics.activeRulesCount}
          icon={<Cpu size={18} />}
          subtext="Snort & Suricata rulesets"
          isDemo={isMock}
        />

        <StatCard
          title="Backend / DB Status"
          value={isConnected ? 'HEALTHY' : 'OFFLINE'}
          icon={<Server size={18} />}
          subtext={`Database: ${databaseStatus}`}
          isDemo={isMock}
        />
      </div>

      {/* Visualizations Grid */}
      <div className={styles.chartsGrid}>
        <TrafficOverviewChart data={trafficActivity} isDemo={isMock} />
        <ProtocolDistributionChart data={protocolDistribution} />
      </div>

      {/* Top Source IPs & Destination Ports */}
      <TopEntities topIps={topSourceIps} topPorts={topDestinationPorts} />
    </div>
  );
};
