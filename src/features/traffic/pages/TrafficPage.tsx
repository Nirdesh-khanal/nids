import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import styles from './TrafficPage.module.scss';
import { useTraffic } from '../hooks/useTraffic';
import type { TrafficFilter, TrafficRecord } from '../types/traffic.types';
import { TrafficDetailModal } from '../components/TrafficDetailModal';
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

export const TrafficPage: React.FC = () => {
  const useMockData = useAppStore((state) => state.useMockData);

  const [filter, setFilter] = useState<TrafficFilter>({
    search: '',
    protocol: 'ALL',
    classification: 'ALL',
    page: 1,
    pageSize: 10,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const [selectedRecord, setSelectedRecord] = useState<TrafficRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, isPending, isError, error, refetch, isFetching } = useTraffic(filter);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, protocol: e.target.value, page: 1 }));
  };

  const handleClassificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, classification: e.target.value, page: 1 }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }));
  };

  const handleSort = (field: string) => {
    setFilter((prev) => {
      const isSameField = prev.sortBy === field;
      const nextOrder = isSameField && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return { ...prev, sortBy: field, sortOrder: nextOrder, page: 1 };
    });
  };

  const handleRowClick = (record: TrafficRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleExportCsv = () => {
    if (!data?.results || data.results.length === 0) {
      toast.error('No traffic records to export');
      return;
    }
    const headers = ['ID', 'Timestamp', 'Source IP', 'Source Port', 'Destination IP', 'Destination Port', 'Protocol', 'Length', 'Classification'];
    const rows = data.results.map((r) => [
      r.id,
      r.timestamp,
      r.sourceIp,
      r.sourcePort,
      r.destinationIp,
      r.destinationPort,
      r.protocol,
      r.packetLength,
      r.classification,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sentinel_traffic_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Traffic records exported to CSV');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>Network Traffic Analysis</span>
            {useMockData && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Inspected packet streams, deep packet inspection metadata, and live session classification.
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
            Refresh Feed
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={styles.filterBar}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Search by IP address, port, or payload..."
            value={filter.search}
            onChange={handleSearchChange}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div className={styles.selectWrapper}>
          <Select
            label="Protocol"
            value={filter.protocol}
            onChange={handleProtocolChange}
            options={[
              { value: 'ALL', label: 'All Protocols' },
              { value: 'TCP', label: 'TCP' },
              { value: 'UDP', label: 'UDP' },
              { value: 'ICMP', label: 'ICMP' },
              { value: 'HTTP', label: 'HTTP' },
              { value: 'DNS', label: 'DNS' },
            ]}
          />
        </div>

        <div className={styles.selectWrapper}>
          <Select
            label="Classification"
            value={filter.classification}
            onChange={handleClassificationChange}
            options={[
              { value: 'ALL', label: 'All Classes' },
              { value: 'NORMAL', label: 'Normal Traffic' },
              { value: 'SUSPICIOUS', label: 'Suspicious' },
              { value: 'MALICIOUS', label: 'Malicious' },
              { value: 'ANOMALOUS', label: 'Anomalous' },
            ]}
          />
        </div>
      </div>

      {/* Traffic Table Card */}
      <div className={styles.tableCard}>
        {isPending ? (
          <TableSkeleton rows={8} columns={7} />
        ) : isError ? (
          <ErrorState
            title="Failed to Load Traffic Records"
            message={error?.message || 'Unable to retrieve packet records from the backend API.'}
            onRetry={() => refetch()}
          />
        ) : !data || data.results.length === 0 ? (
          <EmptyState
            title="No matching traffic packets"
            description="Try modifying search keywords or clearing protocol/classification filters."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter({
                    search: '',
                    protocol: 'ALL',
                    classification: 'ALL',
                    page: 1,
                    pageSize: 10,
                    sortBy: 'timestamp',
                    sortOrder: 'desc',
                  })
                }
              >
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={styles.tableResponsive}>
              <table className={styles.trafficTable} aria-label="Network Traffic Table">
                <thead>
                  <tr>
                    <th
                      className={styles.sortable}
                      onClick={() => handleSort('timestamp')}
                      title="Click to sort by timestamp"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Timestamp</span>
                        {filter.sortBy === 'timestamp' ? (
                          filter.sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </div>
                    </th>
                    <th>Source IP:Port</th>
                    <th>Destination IP:Port</th>
                    <th>Protocol</th>
                    <th
                      className={styles.sortable}
                      onClick={() => handleSort('packetLength')}
                      title="Click to sort by length"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Length</span>
                        {filter.sortBy === 'packetLength' ? (
                          filter.sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </div>
                    </th>
                    <th>Classification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((record) => {
                    const timeFormatted = (() => {
                      try {
                        return format(new Date(record.timestamp), 'HH:mm:ss.SSS');
                      } catch {
                        return record.timestamp;
                      }
                    })();

                    const classBadgeVariant =
                      record.classification === 'MALICIOUS'
                        ? 'critical'
                        : record.classification === 'SUSPICIOUS' || record.classification === 'ANOMALOUS'
                        ? 'high'
                        : 'info';

                    return (
                      <tr key={record.id} onClick={() => handleRowClick(record)}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                          {timeFormatted}
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          <span style={{ fontWeight: 600 }}>{record.sourceIp}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>:{record.sourcePort}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          <span style={{ fontWeight: 600 }}>{record.destinationIp}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>:{record.destinationPort}</span>
                        </td>
                        <td>
                          <Badge variant="neutral">{record.protocol}</Badge>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>
                          {record.packetLength} B
                        </td>
                        <td>
                          <Badge variant={classBadgeVariant}>{record.classification}</Badge>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(record);
                            }}
                            leftIcon={<Eye size={14} />}
                            title="Inspect Packet"
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Toolbar */}
            <div className={styles.pagination}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>
                  Showing {(data.page - 1) * data.pageSize + 1} -{' '}
                  {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} records
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Rows:</span>
                  <select
                    value={filter.pageSize}
                    onChange={handlePageSizeChange}
                    style={{
                      backgroundColor: 'var(--color-bg-input)',
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-primary)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

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

      {/* Row Inspection Modal */}
      <TrafficDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};
