'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../products';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      <p className="text-xl text-muted-foreground mb-6">
        {product.description}
      </p>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-3xl font-bold">${product.price}</span>
        <Button size="lg" className="flex-1">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}
