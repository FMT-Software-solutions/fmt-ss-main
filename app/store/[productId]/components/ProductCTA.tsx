'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PriceDisplay } from '@/components/PriceDisplay';
import { getCurrentPrice } from '@/lib/utils';
import { IPremiumApp } from '@/types/premium-app';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { issuesClient } from '@/services/issues/client';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cart';

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
  const currentPrice = getCurrentPrice(product);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    try {
      addItem(product);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      // Log add to cart error
      await issuesClient.logAppError(
        error instanceof Error ? error : 'Failed to add product to cart',
        'ProductCTA',
        'cart_operation',
        'medium',
        {
          productId: product._id,
          productName: product.title,
          price: currentPrice,
          action: 'add_to_cart'
        }
      );
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <Card className="bg-muted mt-8 mb-4 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              Ready to get started with {product.title}?
            </h3>
            <p className="text-muted-foreground mb-4">
              Experience all the amazing features today.
            </p>

            {/* Pricing Section */}
            <div className="mb-4">
              <PriceDisplay product={product} size="md" className="mb-2" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <Button onClick={onBuyNow} size="lg" className="whitespace-nowrap">
              <CreditCard className="mr-2 h-5 w-5" />
              Buy Now - GHS {currentPrice.toFixed(2)}
            </Button>
            <Button
              onClick={onAddToCart}
              size="lg"
              variant="outline"
              className="whitespace-nowrap"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
