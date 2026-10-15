import React, { useState } from 'react';
import {
  Search,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import styles from './AlertsPage.module.scss';
import { useAlerts, useUpdateAlertStatus } from '../hooks/useAlerts';
import { AlertFilter, SecurityAlert, AlertStatus } from '../types/alerts.types';
import { AlertDetailModal } from '../components/AlertDetailModal';
import { AlertConfirmModal } from '../components/AlertConfirmModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';

export const AlertsPage: React.FC = () => {
  const useMockData = useAppStore((state) => state.useMockData);

  const [filter, setFilter] = useState<AlertFilter>({
    search: '',
    severity: 'ALL',
    status: 'ALL',
    page: 1,
    pageSize: 10,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirmation state for important actions
  const [confirmTarget, setConfirmTarget] = useState<{
    alertId: string;
    nextStatus: AlertStatus;
    title: string;
    message: string;
  } | null>(null);

  const { data, isPending, isError, error, refetch, isFetching } = useAlerts(filter);
  const updateStatusMutation = useUpdateAlertStatus();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, severity: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleRowClick = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  const handleInitiateStatusChange = (alertId: string, nextStatus: AlertStatus) => {
    if (nextStatus === 'RESOLVED' || nextStatus === 'DISMISSED') {
      setConfirmTarget({
        alertId,
        nextStatus,
        title: `Confirm Mark ${nextStatus}`,
        message: `Are you sure you want to change alert ${alertId} status to ${nextStatus}? This indicates the security threat has been mitigated or verified false positive.`,
      });
    } else {
      executeStatusChange(alertId, nextStatus);
    }
  };

  const executeStatusChange = (alertId: string, nextStatus: AlertStatus) => {
    updateStatusMutation.mutate(
      { alertId, status: nextStatus },
      {
        onSuccess: (updated) => {
          toast.success(`Alert ${alertId} status updated to ${nextStatus}`);
          setConfirmTarget(null);
          if (selectedAlert?.id === alertId) {
            setSelectedAlert(updated);
          }
        },
        onError: (err) => {
          toast.error(`Failed to update alert: ${err.message}`);
        },
      }
    );
  };

  const handleExportCsv = () => {
    if (!data?.results || data.results.length === 0) {
      toast.error('No alerts to export');
      return;
    }
    const headers = ['ID', 'Title', 'Signature', 'Severity', 'Status', 'Source IP', 'Destination IP', 'Protocol', 'Timestamp'];
    const rows = data.results.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      a.signatureId,
      a.severity,
      a.status,
      a.sourceIp,
      a.destinationIp,
      a.protocol,
      a.timestamp,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sentinel_alerts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Alerts exported to CSV');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>Security Alerts & Incidents</span>
            {useMockData && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Intrusion detection events triggered by signature matches, statistical flow deviations, and threat intelligence feeds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download size={14} />}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh Alerts
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={styles.filterBar}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Search by Alert ID, detection name, signature, or IP..."
            value={filter.search}
            onChange={handleSearchChange}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div className={styles.selectWrapper}>
          <Select
            label="Severity"
            value={filter.severity}
            onChange={handleSeverityChange}
            options={[
              { value: 'ALL', label: 'All Severities' },
              { value: 'CRITICAL', label: 'Critical' },
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
          />
        </div>

        <div className={styles.selectWrapper}>
          <Select
            label="Status"
            value={filter.status}
            onChange={handleStatusChange}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'NEW', label: 'New' },
              { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
              { value: 'RESOLVED', label: 'Resolved' },
              { value: 'DISMISSED', label: 'Dismissed' },
            ]}
          />
        </div>
      </div>

      {/* Alerts Table Card */}
      <div className={styles.tableCard}>
        {isPending ? (
          <TableSkeleton rows={8} columns={7} />
        ) : isError ? (
          <ErrorState
            title="Failed to Load Security Alerts"
            message={error?.message || 'Unable to retrieve alert records from the backend API.'}
            onRetry={() => refetch()}
          />
        ) : !data || data.results.length === 0 ? (
          <EmptyState
            title="No security alerts match filters"
            description="No intrusions recorded in current parameters."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter({
                    search: '',
                    severity: 'ALL',
                    status: 'ALL',
                    page: 1,
                    pageSize: 10,
                    sortBy: 'timestamp',
                    sortOrder: 'desc',
                  })
                }
              >
                Reset Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={styles.tableResponsive}>
              <table className={styles.alertsTable} aria-label="Security Alerts Table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Alert ID / Detection</th>
                    <th>Source Host</th>
                    <th>Target Host</th>
                    <th>Protocol</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((alert) => {
                    const timeFormatted = (() => {
                      try {
                        return format(new Date(alert.timestamp), 'HH:mm:ss');
                      } catch {
                        return alert.timestamp;
                      }
                    })();

                    const sevVariant =
                      alert.severity === 'CRITICAL'
                        ? 'critical'
                        : alert.severity === 'HIGH'
                        ? 'high'
                        : alert.severity === 'MEDIUM'
                        ? 'medium'
                        : 'low';

                    return (
                      <tr key={alert.id} onClick={() => handleRowClick(alert)}>
                        <td>
                          <Badge variant={sevVariant}>{alert.severity}</Badge>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {alert.title}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                              {alert.id} • {alert.signatureId}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          <span style={{ fontWeight: 600 }}>{alert.sourceIp}</span>
                          {alert.sourcePort ? <span style={{ color: 'var(--color-text-muted)' }}>:{alert.sourcePort}</span> : null}
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          <span style={{ fontWeight: 600 }}>{alert.destinationIp}</span>
                          {alert.destinationPort ? <span style={{ color: 'var(--color-text-muted)' }}>:{alert.destinationPort}</span> : null}
                        </td>
                        <td>
                          <Badge variant="neutral">{alert.protocol}</Badge>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                          {timeFormatted}
                        </td>
                        <td>
                          <Badge variant={alert.status === 'RESOLVED' ? 'info' : 'neutral'}>
                            {alert.status}
                          </Badge>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRowClick(alert)}
                              leftIcon={<Eye size={13} />}
                              title="View Details"
                            >
                              Triage
                            </Button>
                            {alert.status === 'NEW' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInitiateStatusChange(alert.id, 'ACKNOWLEDGED')}
                                title="Acknowledge alert"
                              >
                                Ack
                              </Button>
                            )}
                            {alert.status !== 'RESOLVED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInitiateStatusChange(alert.id, 'RESOLVED')}
                                title="Resolve incident"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span>
                Showing {(data.page - 1) * data.pageSize + 1} -{' '}
                {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} alerts
              </span>

              <div className={styles.paginationActions}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => setFilter((prev) => ({ ...prev, page: prev.page - 1 }))}
                  leftIcon={<ChevronLeft size={14} />}
                >
                  Prev
                </Button>
                <span style={{ padding: '0 8px', fontWeight: 600 }}>
                  Page {data.page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page >= data.totalPages}
                  onClick={() => setFilter((prev) => ({ ...prev, page: prev.page + 1 }))}
                  rightIcon={<ChevronRight size={14} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Alert Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAlert(null);
        }}
        onStatusChange={handleInitiateStatusChange}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Confirmation Dialog */}
      <AlertConfirmModal
        isOpen={confirmTarget !== null}
        title={confirmTarget?.title || 'Confirm Action'}
        message={confirmTarget?.message || ''}
        confirmLabel={confirmTarget?.nextStatus === 'RESOLVED' ? 'Mark Resolved' : 'Confirm'}
        confirmVariant={confirmTarget?.nextStatus === 'RESOLVED' ? 'primary' : 'danger'}
        isLoading={updateStatusMutation.isPending}
        onConfirm={() => {
          if (confirmTarget) {
            executeStatusChange(confirmTarget.alertId, confirmTarget.nextStatus);
          }
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};
