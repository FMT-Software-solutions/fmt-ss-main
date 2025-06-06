'use client';

import { useCartStore } from '../../store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { getSanityImageUrl } from '@/lib/utils';
import { CartItem } from '../../types/cart';

export default function CartContent() {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add some premium apps to your cart to get started."
      >
        <Button onClick={() => router.push('/store')}>
          Browse Premium Apps
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Review your items before proceeding to checkout.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item: CartItem) => (
            <Card key={item.productId} className="p-4">
              <div className="flex gap-4">
                <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg">
                  <Image
                    src={getSanityImageUrl(item.product.mainImage)}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{item.product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    GHS {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">
                      GHS {item.product.price.toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GHS {total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>GHS {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={() => router.push('/store/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
