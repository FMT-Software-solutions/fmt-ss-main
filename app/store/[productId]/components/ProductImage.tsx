'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IPremiumApp } from '@/types/premium-app';

interface ProductImageProps {
  product: IPremiumApp;
}

export default function ProductImage({ product }: ProductImageProps) {
  return (
    <div>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {product.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
