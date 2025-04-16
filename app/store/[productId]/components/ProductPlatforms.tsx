'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IPremiumApp } from '@/types/premium-app';
import { motion } from 'framer-motion';
import { Globe, Monitor, Smartphone } from 'lucide-react';

interface ProductPlatformsProps {
  platforms: IPremiumApp['platforms'];
}

// Platform icons
const platformIcons: Record<string, React.ReactNode> = {
  globe: <Globe className="h-4 w-4 mr-1" />,
  monitor: <Monitor className="h-4 w-4 mr-1" />,
  smartphone: <Smartphone className="h-4 w-4 mr-1" />,
};

export default function ProductPlatforms({ platforms }: ProductPlatformsProps) {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-12"
    >
      <Card className="shadow-md">
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
    </motion.div>
  );
}
