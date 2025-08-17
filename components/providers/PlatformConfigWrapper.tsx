'use client';

import { PlatformConfigProvider } from '@/contexts/PlatformConfigContext';
import { PlatformConfig } from '@/types/config';
import { ReactNode } from 'react';

interface PlatformConfigWrapperProps {
  children: ReactNode;
  initialConfig: PlatformConfig | null;
}

export function PlatformConfigWrapper({ children, initialConfig }: PlatformConfigWrapperProps) {
  return (
    <PlatformConfigProvider initialConfig={initialConfig}>
      {children}
    </PlatformConfigProvider>
  );
}