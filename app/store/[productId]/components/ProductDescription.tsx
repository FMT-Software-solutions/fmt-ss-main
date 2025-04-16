'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IPremiumApp } from '@/types/premium-app';
import { PortableText } from '@portabletext/react';
import ProductImage from './ProductImage';

interface ProductDescriptionProps {
  product: IPremiumApp;
}

export default function ProductDescription({
  product,
}: ProductDescriptionProps) {
  return (
    <Card className="mb-12 shadow-lg overflow-hidden bg-card p-8">
      <CardContent className="p-0">
        <div className="grid gap-8 md:grid-cols-2">
          <ProductImage
            title={product.title}
            mainImage={product.mainImage}
            tags={product.tags}
          />
          <div className="p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">About {product.title}</h2>
            {product.description && (
              <div className="prose dark:prose-invert max-w-none">
                <PortableText value={product.description} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
