'use client';

import { PlatformConfigProvider, usePlatformConfigContext } from '@/contexts/PlatformConfigContext';
import { PlatformConfig } from '@/types/config';
import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface PlatformConfigWrapperProps {
  children: ReactNode;
  initialConfig: PlatformConfig | null;
}

// user_feature_flags: {
//   public_projects: boolean;
//   free_apps: boolean;
//   training: boolean;
//   marketplace: boolean;
//   stats_counter: boolean;
//  };

function FeatureGateContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config, loading } = usePlatformConfigContext();

  const isPublic = pathname?.startsWith('/public');
  const isFree = pathname?.startsWith('/free');
  const isTraining = pathname?.startsWith('/training');
  const isMarketplace = pathname?.startsWith('/marketplace');

  // Don't redirect while loading config
  if (loading) {
    return <>{children}</>;
  }

  // Only redirect if config is loaded and feature is disabled
  if (config) {
    if (isPublic && !config.user_feature_flags?.public_projects) {
      router.push('/');
      return null;
    }

    if (isFree && !config.user_feature_flags?.free_apps) {
      router.push('/');
      return null;
    }

    if (isTraining && !config.user_feature_flags?.training) {
      router.push('/');
      return null;
    }

    if (isMarketplace && !config.user_feature_flags?.marketplace) {
      router.push('/');
      return null;
    }
  }

  return <>{children}</>;
}

export function PlatformConfigWrapper({
  children,
  initialConfig,
}: PlatformConfigWrapperProps) {
  return (
    <PlatformConfigProvider initialConfig={initialConfig}>
      <FeatureGateContent>{children}</FeatureGateContent>
    </PlatformConfigProvider>
  );
}
