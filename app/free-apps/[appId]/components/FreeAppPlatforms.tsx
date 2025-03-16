'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Monitor, Smartphone } from 'lucide-react';
import { FreeApp } from '../../data';

interface FreeAppPlatformsProps {
  platforms: FreeApp['platforms'];
}

export default function FreeAppPlatforms({ platforms }: FreeAppPlatformsProps) {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  const platformIcons = {
    web: Globe,
    desktop: Monitor,
    mobile: Smartphone,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Platforms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {platforms.map((platform, index) => {
            const IconComponent =
              platform.icon &&
              platformIcons[platform.icon as keyof typeof platformIcons];

            return (
              <div key={index} className="flex items-center gap-2">
                {IconComponent && <IconComponent className="h-5 w-5" />}
                <span>{platform.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
