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
    <div>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="hidden md:flex flex-wrap gap-2 mb-6 ">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
