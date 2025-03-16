'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

// Define the ExtendedProduct type to match the one in ProductPageClient
interface ExtendedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  features: string[];
  requirements: {
    os: string[];
    processor: string;
    memory: string;
    storage: string;
  };
  platforms?: Array<{
    name: string;
    slug: { current: string };
    icon: string;
  }>;
  downloadUrl?: string | null;
  webAppUrl?: string | null;
}

interface ProductImageProps {
  product: ExtendedProduct;
}

export default function ProductImage({ product }: ProductImageProps) {
  return (
    <div>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image
          src={product.image}
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
