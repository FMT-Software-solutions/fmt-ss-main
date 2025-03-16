'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Monitor, Smartphone } from 'lucide-react';
import { IFreeApp } from '@/types/free-app';

interface FreeAppPlatformsProps {
  platforms: IFreeApp['platforms'];
}

// Platform icons mapping
const platformIcons: Record<string, React.ReactNode> = {
  web: <Globe className="h-4 w-4 mr-1" />,
  desktop: <Monitor className="h-4 w-4 mr-1" />,
  mobile: <Smartphone className="h-4 w-4 mr-1" />,
};

export default function FreeAppPlatforms({ platforms }: FreeAppPlatformsProps) {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Platforms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {platforms.map((platform) => (
            <Badge
              key={platform.slug.current}
              variant="outline"
              className="flex items-center text-base py-2 px-3"
            >
              {platformIcons[platform.icon] || null}
              {platform.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
