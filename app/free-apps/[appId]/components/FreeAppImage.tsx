'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { FreeApp } from '../../data';

interface FreeAppImageProps {
  app: FreeApp;
}

export default function FreeAppImage({ app }: FreeAppImageProps) {
  if (!app.image) {
    return null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden aspect-video">
      <Image
        src={app.image}
        alt={app.title}
        fill
        className="object-cover"
        priority
      />

      {app.tags && app.tags.length > 0 && (
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {app.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="bg-background/80 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
