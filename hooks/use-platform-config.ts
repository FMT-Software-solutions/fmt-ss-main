'use client';

import { useContext, useEffect, useState } from 'react';
import { PlatformConfig } from '@/types/config';
import { platformConfigClient } from '@/services/config/platformConfigClient';
import { PlatformConfigContext } from '@/contexts/PlatformConfigContext';

/**
 * Hook to access platform configuration from context
 * This is the preferred way to access config in components
 */
export function usePlatformConfig() {
  const context = useContext(PlatformConfigContext);
  
  if (context === undefined) {
    throw new Error('usePlatformConfig must be used within a PlatformConfigProvider');
  }
  
  return context;
}

/**
 * Hook to fetch platform configuration directly (fallback)
 * Use this only if you need to fetch config outside of the provider context
 */
export function usePlatformConfigDirect() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await platformConfigClient.getPlatformConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch platform config');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<PlatformConfig>) => {
    try {
      setError(null);
      const updatedConfig = await platformConfigClient.updatePlatformConfig(updates);
      if (updatedConfig) {
        setConfig(updatedConfig);
      }
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update platform config');
      return null;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
    updateConfig
  };
}

/**
 * Hook to check if a specific feature is enabled
 */
export function useFeatureFlag(flagPath: string) {
  const { config } = usePlatformConfig();
  
  const getNestedValue = (obj: any, path: string): boolean => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : false;
    }, obj);
  };
  
  if (!config) return false;
  
  // Check in user_feature_flags first, then admin_feature_flags
  const userFlag = getNestedValue(config.user_feature_flags, flagPath);
  const adminFlag = getNestedValue(config.admin_feature_flags, flagPath);
  
  return userFlag || adminFlag;
}

/**
 * Hook to check multiple feature flags at once
 */
export function useFeatureFlags(flagPaths: string[]) {
  const { config } = usePlatformConfig();
  
  const getNestedValue = (obj: any, path: string): boolean => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : false;
    }, obj);
  };
  
  if (!config) {
    return flagPaths.reduce((acc, path) => ({ ...acc, [path]: false }), {});
  }
  
  return flagPaths.reduce((acc, path) => {
    const userFlag = getNestedValue(config.user_feature_flags, path);
    const adminFlag = getNestedValue(config.admin_feature_flags, path);
    return { ...acc, [path]: userFlag || adminFlag };
  }, {});
}