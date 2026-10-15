import React from 'react';
import {
  Sun,
  Moon,
  FlaskConical,
  RefreshCw,
} from 'lucide-react';
import styles from './SettingsPage.module.scss';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAppStore } from '@/stores/useAppStore';
import { useHealth } from '@/features/system/hooks/useHealth';
import { env } from '@/lib/env';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { useMockData, toggleMockData, sidebarCollapsed, toggleSidebar } = useAppStore();
  const { isConnected, isPending: isCheckingHealth, databaseStatus, refetch: checkHealth } = useHealth();

  const handleProbeHealth = () => {
    checkHealth();
    toast.info('Queried Django backend health endpoint: GET /api/health/');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <span>System Settings & Configuration</span>
            {useMockData && <Badge variant="demo">DEMO DATA</Badge>}
          </h1>
          <p className={styles.subtitle}>
            Manage display preferences, telemetry sources, API connection parameters, and planned detection pipeline settings.
          </p>
        </div>
      </div>

      <div className={styles.settingsGrid}>
        {/* Appearance Settings */}
        <Card>
          <CardHeader
            title="Appearance & Theme"
            description="Customize dashboard visual style and navigation density"
          />
          <CardContent>
            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Theme Mode</span>
                <span className={styles.settingDesc}>
                  Select high-contrast dark cybersecurity SOC palette or crisp daylight mode
                </span>
              </div>
              <div className={styles.themeOptionGroup}>
                <button
                  className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={15} />
                  <span>Dark</span>
                </button>
                <button
                  className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={15} />
                  <span>Light</span>
                </button>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Sidebar State</span>
                <span className={styles.settingDesc}>
                  Current layout: {sidebarCollapsed ? 'Collapsed (icons only)' : 'Expanded'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={toggleSidebar}>
                {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Telemetry & API Connection */}
        <Card>
          <CardHeader
            title="API Connection & Telemetry Mode"
            description="Django backend integration settings and development mock mode"
          />
          <CardContent>
            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Active Telemetry Mode</span>
                <span className={styles.settingDesc}>
                  {useMockData
                    ? 'Using realistic simulated fixtures for academic project evaluation without backend.'
                    : 'Querying live Django REST API service endpoints.'}
                </span>
              </div>
              <Button
                variant={useMockData ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  toggleMockData();
                  toast.success(
                    useMockData ? 'Switched to Live Django API mode' : 'Switched to Mock Telemetry mode'
                  );
                }}
                leftIcon={<FlaskConical size={14} />}
              >
                {useMockData ? 'Mock Mode (Active)' : 'Live Mode (Active)'}
              </Button>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Configured API Base URL</span>
                <span className={styles.settingDesc} style={{ fontFamily: 'monospace' }}>
                  {env.VITE_API_BASE_URL}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProbeHealth}
                isLoading={isCheckingHealth}
                leftIcon={<RefreshCw size={14} />}
              >
                Probe Health
              </Button>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Backend Connection Status</span>
                <span className={styles.settingDesc}>
                  Health: {isConnected ? 'Online (HTTP 200)' : 'Offline / Unreachable'} • DB: {databaseStatus}
                </span>
              </div>
              <Badge variant={isConnected ? 'info' : 'critical'}>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Planned Backend Detection Settings */}
        <Card>
          <CardHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Detection Engine Parameters</span>
                <span className={styles.plannedBadge}>PLANNED SETTINGS</span>
              </div>
            }
            description="Configuration options reserved for Django backend packet capture deployment"
          />
          <CardContent>
            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Packet Capture Interface</span>
                <span className={styles.settingDesc}>Network interface for raw libpcap socket sniffing</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                eth0 (Promiscuous)
              </span>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Signature Ruleset Directory</span>
                <span className={styles.settingDesc}>File path for Snort and Suricata .rules ingestion</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                /etc/sentinel/rules/
              </span>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Anomaly Threshold (Z-Score)</span>
                <span className={styles.settingDesc}>Standard deviation trigger limit for volumetric spikes</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                3.0 σ
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Project & Application Information */}
        <Card>
          <CardHeader
            title="Application Information"
            description="Academic project metadata and frontend architectural stack"
          />
          <CardContent>
            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>System Title</span>
                <span className={styles.settingDesc}>SENTINEL Network Intrusion Detection System</span>
              </div>
              <Badge variant="neutral">v1.0.0-PROD</Badge>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Academic Project</span>
                <span className={styles.settingDesc}>Bachelor of Computer Applications (BCA) - Semester 7</span>
              </div>
              <Badge variant="info">FINAL YEAR PROJECT</Badge>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingLabelGroup}>
                <span className={styles.settingLabel}>Frontend Technology Architecture</span>
                <span className={styles.settingDesc}>
                  React 19, TypeScript, Vite, TanStack Query, TanStack Table, SCSS Modules, Zod, Recharts
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Strict Clean Architecture</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
