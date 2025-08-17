# Platform Configuration Service

This service provides a comprehensive platform configuration system for the Next.js application, allowing you to manage feature flags and configuration settings through Supabase.

## Overview

The platform config system consists of:
- **Service Layer**: Client and server-side services for Supabase queries
- **React Hook**: Easy-to-use hooks for accessing config in components
- **Global Context**: React context provider for app-wide config access
- **Type Safety**: Full TypeScript support with the `PlatformConfig` interface

## Usage Examples

### 1. Using the Hook in Client Components

```tsx
'use client';

import { usePlatformConfig, useFeatureFlag } from '@/services/config';

export function MyComponent() {
  const { config, loading, error } = usePlatformConfig();
  const isPublicProjectsEnabled = useFeatureFlag('public_projects');
  const isFreeAppsEnabled = useFeatureFlag('free_apps');

  if (loading) return <div>Loading configuration...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isPublicProjectsEnabled && (
        <section>Public Projects Section</section>
      )}
      {isFreeAppsEnabled && (
        <section>Free Apps Section</section>
      )}
    </div>
  );
}
```

### 2. Using Multiple Feature Flags

```tsx
'use client';

import { useFeatureFlags } from '@/services/config';

export function FeatureGatedComponent() {
  const flags = useFeatureFlags([
    'public_projects',
    'free_apps',
    'training',
    'marketplace'
  ]);

  return (
    <nav>
      {flags.public_projects && <a href="/projects">Projects</a>}
      {flags.free_apps && <a href="/free-apps">Free Apps</a>}
      {flags.training && <a href="/training">Training</a>}
      {flags.marketplace && <a href="/store">Store</a>}
    </nav>
  );
}
```

### 3. Server-Side Usage

```tsx
import { platformConfigServer } from '@/services/config';

export default async function ServerComponent() {
  const config = await platformConfigServer.getPlatformConfig();
  
  if (!config?.user_feature_flags.public_projects) {
    return <div>Public projects are disabled</div>;
  }

  return (
    <div>
      <h1>Public Projects</h1>
      {/* Your component content */}
    </div>
  );
}
```

### 4. API Route Usage

```tsx
// app/api/config/route.ts
import { NextResponse } from 'next/server';
import { platformConfigServer } from '@/services/config';

export async function GET() {
  try {
    const config = await platformConfigServer.getPlatformConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const updatedConfig = await platformConfigServer.updatePlatformConfig(updates);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
```

### 5. Higher-Order Component Usage

```tsx
import { withPlatformConfig } from '@/services/config';

function MyComponent() {
  // Component logic here
  return <div>My Component</div>;
}

// Wrap component with platform config context
export default withPlatformConfig(MyComponent);
```

### 6. Direct Service Usage (Advanced)

```tsx
'use client';

import { platformConfigClient } from '@/services/config';
import { useEffect, useState } from 'react';

export function AdminConfigPanel() {
  const [config, setConfig] = useState(null);

  const handleUpdateConfig = async (updates) => {
    const updatedConfig = await platformConfigClient.updatePlatformConfig(updates);
    if (updatedConfig) {
      setConfig(updatedConfig);
    }
  };

  useEffect(() => {
    platformConfigClient.getPlatformConfig().then(setConfig);
  }, []);

  return (
    <div>
      {/* Admin interface for updating config */}
    </div>
  );
}
```

## Configuration Structure

The `PlatformConfig` interface defines the structure:

```typescript
export interface PlatformConfig {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_feature_flags: {
    public_projects: boolean;
    free_apps: boolean;
    training: boolean;
    marketplace: boolean;
  };
  admin_feature_flags: {
    // Add admin-specific flags here
  };
}
```

## Database Setup

Ensure your Supabase database has a `platform_config` table with the following structure:

```sql
CREATE TABLE platform_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_feature_flags JSONB NOT NULL DEFAULT '{}',
  admin_feature_flags JSONB NOT NULL DEFAULT '{}'
);

-- Insert default configuration
INSERT INTO platform_config (user_feature_flags, admin_feature_flags)
VALUES (
  '{
    "public_projects": true,
    "free_apps": true,
    "training": true,
    "marketplace": true
  }',
  '{}'
);
```

## Best Practices

1. **Use the Context**: Always prefer `usePlatformConfig()` over direct service calls
2. **Feature Flags**: Use `useFeatureFlag()` for single flags and `useFeatureFlags()` for multiple flags
3. **Server-Side**: Use `platformConfigServer` in server components and API routes
4. **Error Handling**: Always handle loading and error states in your components
5. **Type Safety**: Leverage TypeScript for better development experience

## Performance Notes

- Configuration is loaded server-side in the root layout for optimal performance
- The context provider prevents unnecessary re-renders
- Client-side services use singleton pattern for efficiency
- Server-side services are stateless and optimized for SSR