'use client';

import { PlatformConfigProvider } from '@/contexts/PlatformConfigContext';
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

export function PlatformConfigWrapper({
  children,
  initialConfig,
}: PlatformConfigWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = pathname?.startsWith('/public');
  const isFree = pathname?.startsWith('/free');
  const isTraining = pathname?.startsWith('/training');
  const isMarketplace = pathname?.startsWith('/marketplace');

  if (isPublic && !initialConfig?.user_feature_flags?.public_projects) {
    router.push('/');
    return null;
  }

  if (isFree && !initialConfig?.user_feature_flags?.free_apps) {
    router.push('/');
    return null;
  }

  if (isTraining && !initialConfig?.user_feature_flags?.training) {
    router.push('/');
    return null;
  }

  if (isMarketplace && !initialConfig?.user_feature_flags?.marketplace) {
    router.push('/');
    return null;
  }

  return (
    <PlatformConfigProvider initialConfig={initialConfig}>
      {children}
    </PlatformConfigProvider>
  );
}
