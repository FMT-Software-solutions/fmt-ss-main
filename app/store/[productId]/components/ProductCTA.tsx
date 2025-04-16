'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IPremiumApp } from '@/types/premium-app';
import { CreditCard, ShoppingCart } from 'lucide-react';

interface ProductCTAProps {
  product: IPremiumApp;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export default function ProductCTA({
  product,
  onBuyNow,
  onAddToCart,
}: ProductCTAProps) {
  return (
    <Card className="bg-muted mt-8 mb-4 shadow-md">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">
            Ready to get started with {product.title}?
          </h3>
          <p className="text-muted-foreground">
            Experience all the amazing features today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onBuyNow} size="lg">
            <CreditCard className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
          <Button onClick={onAddToCart} size="lg" variant="outline">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
