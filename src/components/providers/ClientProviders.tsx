'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import SettingsDrawer from '@/components/layout/SettingsDrawer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <SettingsDrawer />
      </AuthProvider>
    </ThemeProvider>
  );
}
