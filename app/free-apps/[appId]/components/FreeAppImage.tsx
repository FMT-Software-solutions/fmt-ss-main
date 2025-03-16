'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IFreeApp } from '@/types/free-app';

interface FreeAppImageProps {
  app: IFreeApp;
}

export default function FreeAppImage({ app }: FreeAppImageProps) {
  return (
    <div>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image
          src={app.mainImage}
          alt={app.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {app.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
