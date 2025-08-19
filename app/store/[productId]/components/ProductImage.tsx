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

  // Fallback image if no image URL is available
  const fallbackImage = '/images/placeholder-app.svg';
  const finalImageUrl = imageUrl || fallbackImage;

  return (
    <div className="relative h-full group">
      <div className="relative h-full rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
        <Image
          src={finalImageUrl}
          alt={title}
          width={1000}
          height={1000}
          className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
          priority
          onError={(e) => {
            console.error('Image failed to load:', finalImageUrl);
            // Set fallback image on error
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>
    </div>
  );
}
