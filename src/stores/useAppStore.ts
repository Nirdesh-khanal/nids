import { create } from 'zustand';
import { env } from '@/lib/env';

interface AppState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  useMockData: boolean;
  globalSearchOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setUseMockData: (useMock: boolean) => void;
  toggleMockData: () => void;
  setGlobalSearchOpen: (open: boolean) => void;
}

const MOCK_STORAGE_KEY = 'sentinel_use_mock_data';

const getInitialMockDataSetting = (): boolean => {
  // Check localStorage first
  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  // Otherwise fallback to environment configuration
  return env.VITE_USE_MOCK_DATA;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  useMockData: getInitialMockDataSetting(),
  globalSearchOpen: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

  setUseMockData: (useMock) => {
    localStorage.setItem(MOCK_STORAGE_KEY, String(useMock));
    set({ useMockData: useMock });
  },
  toggleMockData: () =>
    set((state) => {
      const next = !state.useMockData;
      localStorage.setItem(MOCK_STORAGE_KEY, String(next));
      return { useMockData: next };
    }),

  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
}));
