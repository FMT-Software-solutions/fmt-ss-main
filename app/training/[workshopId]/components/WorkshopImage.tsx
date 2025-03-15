'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Workshop } from '../../workshops';

interface WorkshopImageProps {
  workshop: Workshop;
}

export default function WorkshopImage({ workshop }: WorkshopImageProps) {
  return (
    <div>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image
          src={workshop.image}
          alt={workshop.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary">{workshop.type}</Badge>
        {workshop.price === 0 && <Badge variant="outline">Free</Badge>}
      </div>
    </div>
  );
}
