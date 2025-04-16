'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IPremiumApp } from '@/types/premium-app';
import { getSanityImageUrl } from '@/lib/utils';

interface ProductImageProps {
  mainImage: any;
  title: string;
  tags: string[];
}

export default function ProductImage({
  mainImage,
  title,
  tags,
}: ProductImageProps) {
  const imageUrl = getSanityImageUrl(mainImage);

  return (
    <div className="relative h-full group">
      <div className="aspect-video md:aspect-auto md:h-full relative rounded-l-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
    </div>
  );
}
