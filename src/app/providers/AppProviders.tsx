import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Toaster } from 'sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const ToasterWithTheme: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
        },
      }}
    />
  );
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ToasterWithTheme />
      </ThemeProvider>
    </QueryProvider>
  );
};
