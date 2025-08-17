'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PlatformConfig } from '@/types/config';
import { platformConfigClient } from '@/services/config/platformConfigClient';

interface PlatformConfigContextType {
  config: PlatformConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateConfig: (updates: Partial<PlatformConfig>) => Promise<PlatformConfig | null>;
}

export const PlatformConfigContext = createContext<PlatformConfigContextType | undefined>(undefined);

interface PlatformConfigProviderProps {
  children: ReactNode;
  initialConfig?: PlatformConfig | null;
}

export function PlatformConfigProvider({ children, initialConfig }: PlatformConfigProviderProps) {
  const [config, setConfig] = useState<PlatformConfig | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformConfigClient.getPlatformConfig();
      setConfig(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch platform config';
      setError(errorMessage);
      console.error('Platform config fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<PlatformConfig>): Promise<PlatformConfig | null> => {
    try {
      setError(null);
      const updatedConfig = await platformConfigClient.updatePlatformConfig(updates);
      if (updatedConfig) {
        setConfig(updatedConfig);
      }
      return updatedConfig;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update platform config';
      setError(errorMessage);
      console.error('Platform config update error:', err);
      return null;
    }
  };

  useEffect(() => {
    // Only fetch if we don't have initial config
    if (!initialConfig) {
      fetchConfig();
    }
  }, [initialConfig]);

  const contextValue: PlatformConfigContextType = {
    config,
    loading,
    error,
    refetch: fetchConfig,
    updateConfig
  };

  return (
    <PlatformConfigContext.Provider value={contextValue}>
      {children}
    </PlatformConfigContext.Provider>
  );
}

/**
 * Higher-order component to wrap components with platform config context
 */
export function withPlatformConfig<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <PlatformConfigProvider>
        <Component {...props} />
      </PlatformConfigProvider>
    );
  };
}

/**
 * Hook to use platform config context (re-exported for convenience)
 */
export function usePlatformConfigContext() {
  const context = useContext(PlatformConfigContext);
  
  if (context === undefined) {
    throw new Error('usePlatformConfigContext must be used within a PlatformConfigProvider');
  }
  
  return context;
}