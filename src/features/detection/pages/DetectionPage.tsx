import React from 'react';
import {
  Cpu,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';
import styles from './DetectionPage.module.scss';
import { useDetection } from '../hooks/useDetection';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAppStore } from '@/stores/useAppStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const DetectionPage: React.FC = () => {
  const useMockData = useAppStore((state) => state.useMockData);
  const { data, isPending, isError, error, refetch, isFetching } = useDetection();

  if (isPending) {
    return (
      <div className={styles.pageContainer}>
        <Skeleton width="280px" height="32px" />
        <Skeleton width="480px" height="18px" />
        <div className={styles.moduleGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="160px" borderRadius="8px" />
          ))}
        </div>
        <Skeleton height="260px" borderRadius="8px" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.pageContainer}>
        <ErrorState
          title="Failed to Load Detection Engine Telemetry"
          message={error?.message || 'Unable to retrieve detection configuration from the backend.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { modules, mlModel } = data;

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>Intrusion Detection Engine</span>
            {useMockData && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Multi-layered intrusion detection architecture combining deterministic signature matching, statistical flow analytics, and planned machine learning models.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            refetch();
            toast.success('Detection engine status refreshed');
          }}
          isLoading={isFetching}
          leftIcon={<RefreshCw size={14} />}
        >
          Check Engine Status
        </Button>
      </div>

      {/* Overview Status Banner */}
      <Card>
        <CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-accent-cyan-subtle)',
                  color: 'var(--color-accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  CORE PIPELINE STATUS
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {data.engineStatus}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Rules Ingested: </span>
                <strong style={{ fontFamily: 'monospace' }}>{data.totalRules} rules</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Signatures Synced: </span>
                <strong style={{ fontFamily: 'monospace' }}>
                  {(() => {
                    try {
                      return format(new Date(data.lastSignatureUpdate), 'yyyy-MM-dd HH:mm');
                    } catch {
                      return data.lastSignatureUpdate;
                    }
                  })()}
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Modules Grid */}
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '14px' }}>
          Configured Detection Pipelines
        </h2>
        <div className={styles.moduleGrid}>
          {modules.map((mod) => {
            const statusVariant =
              mod.status === 'ACTIVE'
                ? 'info'
                : mod.status === 'PLANNED'
                ? 'high'
                : 'neutral';

            return (
              <div key={mod.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleName}>{mod.name}</div>
                  <Badge variant={statusVariant}>{mod.status.replace('_', ' ')}</Badge>
                </div>
                <p className={styles.moduleDesc}>{mod.description}</p>
                <div className={styles.moduleMeta}>
                  <span>{mod.benchmarkScore || 'Ready'}</span>
                  {mod.rulesLoaded ? (
                    <span style={{ fontFamily: 'monospace' }}>{mod.rulesLoaded} active rules</span>
                  ) : (
                    <span>Planned Module</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine Learning Model Benchmark Overview */}
      <div className={styles.mlSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--color-accent-cyan)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Machine Learning Detection Model
              </h3>
              <Badge variant="high">STATUS: {mlModel.status}</Badge>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Architecture: {mlModel.architecture} • Target Benchmark: {mlModel.targetDataset}
            </p>
          </div>
        </div>

        {/* Callout Notice about academic / planned status */}
        <div className={styles.noticeAlert}>
          <Info size={20} style={{ flexShrink: 0, color: 'var(--color-accent-blue)' }} />
          <div>
            <strong>Architecture Notice for BCA Project Evaluation:</strong> {mlModel.notes}
          </div>
        </div>

        {/* Benchmark Metrics Grid */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Offline Training Benchmark Metrics (CIC-IDS2017 Dataset)
          </div>
          <div className={styles.benchmarkGrid}>
            <div className={styles.benchmarkItem}>
              <div className={styles.benchmarkLabel}>Accuracy</div>
              <div className={styles.benchmarkVal}>{mlModel.benchmarkAccuracy}%</div>
            </div>
            <div className={styles.benchmarkItem}>
              <div className={styles.benchmarkLabel}>Precision</div>
              <div className={styles.benchmarkVal}>{mlModel.benchmarkPrecision}%</div>
            </div>
            <div className={styles.benchmarkItem}>
              <div className={styles.benchmarkLabel}>Recall</div>
              <div className={styles.benchmarkVal}>{mlModel.benchmarkRecall}%</div>
            </div>
            <div className={styles.benchmarkItem}>
              <div className={styles.benchmarkLabel}>F1 Score</div>
              <div className={styles.benchmarkVal}>{mlModel.benchmarkF1}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
