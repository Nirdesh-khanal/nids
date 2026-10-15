import React, { useState } from 'react';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Cpu,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Database,
  FlaskConical,
} from 'lucide-react';
import styles from './DashboardLayout.module.scss';
import { useAppStore } from '@/stores/useAppStore';
import { useTheme } from '../providers/ThemeProvider';
import { useHealth } from '@/features/system/hooks/useHealth';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItemConfig[] = [
  { label: 'Overview', path: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'Network Traffic', path: '/traffic', icon: <Activity size={18} /> },
  { label: 'Security Alerts', path: '/alerts', icon: <ShieldAlert size={18} /> },
  { label: 'Detection Engine', path: '/detection', icon: <Cpu size={18} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
];

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    useMockData,
    toggleMockData,
  } = useAppStore();

  const { isConnected, isPending: isHealthChecking, databaseStatus, isMock, refetch: checkHealth } = useHealth();

  // Dialog States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Derive page title and breadcrumbs
  const currentNav = navItems.find((item) =>
    item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNav?.label || 'Page';

  const handleSearchSelect = (path: string) => {
    setSearchModalOpen(false);
    navigate(path);
  };

  const handleToggleMock = () => {
    toggleMockData();
    const nextMode = !useMockData ? 'Mock/Demo Mode Enabled' : 'Live Backend Mode Enabled';
    toast.info(nextMode, {
      description: !useMockData
        ? 'Using simulated telemetry fixtures for offline demonstration.'
        : 'Connecting directly to Django backend at /api/.',
    });
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile Backdrop */}
      <div
        className={`${styles.mobileBackdrop} ${mobileSidebarOpen ? styles.mobileOpen : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${
          mobileSidebarOpen ? styles.mobileOpen : ''
        }`}
        aria-label="Main Navigation"
      >
        <div className={styles.brandHeader}>
          <div className={styles.logoIcon}>
            <Shield size={20} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>SENTINEL</span>
            <span className={styles.brandTagline}>NIDS Monitor</span>
          </div>
        </div>

        <nav className={styles.navContainer}>
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Status Footer */}
        <div className={styles.statusFooter}>
          <div className={styles.statusIndicator} title={`Database: ${databaseStatus}`}>
            <span
              className={`${styles.statusDot} ${
                isHealthChecking
                  ? styles.checking
                  : isConnected
                  ? styles.online
                  : styles.offline
              }`}
            />
            <div className={styles.statusDetails}>
              <div className={styles.statusTitle}>
                {isHealthChecking
                  ? 'Checking Health...'
                  : isConnected
                  ? 'Backend Connected'
                  : 'Backend Offline'}
              </div>
              <div className={styles.statusSubtitle}>
                {isMock ? 'Mock Telemetry' : `DB: ${databaseStatus}`}
              </div>
            </div>
          </div>

          <button
            className={styles.collapseButton}
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            <span className={styles.collapseText}>Collapse Sidebar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`${styles.mainWrapper} ${
          sidebarCollapsed ? styles.sidebarCollapsed : ''
        }`}
      >
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuTrigger}
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <span>SENTINEL</span>
              <span className={styles.crumbSeparator}>/</span>
              <span className={styles.crumbCurrent}>{pageTitle}</span>
            </nav>
          </div>

          <div className={styles.topbarRight}>
            {/* Mock Mode Switcher Badge */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMock}
              leftIcon={<FlaskConical size={14} />}
              title="Click to toggle between Mock Fixtures and Live Django Backend"
            >
              {useMockData ? 'Mock Mode: ON' : 'Live API Mode'}
            </Button>

            {/* Quick Search */}
            <button
              className={styles.searchButton}
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search navigation"
            >
              <Search size={15} />
              <span>Search modules...</span>
              <span className={styles.kbdShortcut}>Ctrl K</span>
            </button>

            {/* Theme Toggle */}
            <button
              className={styles.topbarActionBtn}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              className={styles.topbarActionBtn}
              onClick={() => setNotificationsModalOpen(true)}
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell size={18} />
              <span className={styles.badgeDot} />
            </button>

            {/* User Profile */}
            <button
              className={styles.userBadge}
              onClick={() => setProfileModalOpen(true)}
              aria-label="View analyst profile"
            >
              <div className={styles.avatar}>SA</div>
              <div style={{ textAlign: 'left' }}>
                <div className={styles.userName}>SecOps Analyst</div>
                <div className={styles.userRole}>BCA Project</div>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>

      {/* Quick Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Quick Navigation & Search"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--color-bg-input)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '6px',
            }}
          >
            <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search sections, alerts, traffic by keyword or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '0.9375rem',
              }}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              NAVIGATION TARGETS
            </span>
            {navItems
              .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleSearchSelect(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-bg-surface-hover)',
                    cursor: 'pointer',
                    transition: 'background-color 150ms',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    {item.path}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        title="Security Notifications"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNotificationsModalOpen(false);
                navigate('/alerts');
              }}
            >
              View All Alerts
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setNotificationsModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-severity-critical-bg)',
              border: '1px solid var(--color-severity-critical-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-severity-critical)' }}>
                SYN Flood Attack Detected
              </span>
              <Badge variant="critical">CRITICAL</Badge>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              192.168.1.105 targeted port 80 with 1,420 packets/sec threshold violation.
            </p>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-severity-high-bg)',
              border: '1px solid var(--color-severity-high-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-severity-high)' }}>
                SSH Brute Force Attempt
              </span>
              <Badge variant="high">HIGH</Badge>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Multiple failed authentication attempts detected from 10.0.0.45 on port 22.
            </p>
          </div>
        </div>
      </Modal>

      {/* Profile / System Info Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Security Analyst Session"
        size="sm"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setProfileModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>SecOps Analyst (L2)</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                BCA Semester 7 Academic Project
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-bg-surface-muted)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.8125rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Backend URL</span>
              <span style={{ fontFamily: 'monospace' }}>http://127.0.0.1:8000/api</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Health Status</span>
              <span style={{ color: isConnected ? 'var(--color-status-online)' : 'var(--color-status-offline)' }}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Active Mode</span>
              <span>{useMockData ? 'Mock / Demo Fixtures' : 'Live Django Service'}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              checkHealth();
              toast.info('Triggered health check probe to backend');
            }}
            leftIcon={<Database size={14} />}
          >
            Re-probe Backend Health
          </Button>
        </div>
      </Modal>
    </div>
  );
};
