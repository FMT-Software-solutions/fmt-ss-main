'use client';

import { Card } from '@/components/ui/card';
import { CartItem, DiscountCode } from '../../types/cart';
import { PaystackButton } from '@/components/PaystackButton';
import { getCurrentPrice, isPromotionActive } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  discountAmount: number;
  appliedDiscount: DiscountCode | null;
  email: string;
  metadata: {
    name: string;
    phone: string;
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  isProcessing: boolean;
  isValid: boolean;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

export function OrderSummary({
  items,
  total,
  subtotal,
  discountAmount,
  appliedDiscount,
  email,
  metadata,
  isProcessing,
  isValid,
  onSuccess,
  onClose,
}: OrderSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-4 mb-4">
        {items.map((item: CartItem) => {
          // Skip items without product data
          if (!item.product) {
            return (
              <div key={item.productId} className="flex justify-between">
                <div>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-16 animate-pulse mt-1" />
                </div>
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              </div>
            );
          }

          const currentPrice = getCurrentPrice(item.product);
          const itemTotal = currentPrice * item.quantity;
          const hasPromotion = isPromotionActive(item.product);

          return (
            <div key={item.productId} className="flex justify-between">
              <div>
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">GHS {itemTotal.toFixed(2)}</p>
                {hasPromotion && (
                  <p className="text-xs text-muted-foreground line-through">
                    GHS {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span>GHS {subtotal.toFixed(2)}</span>
          </div>

          {appliedDiscount && discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center gap-2">
                Discount ({appliedDiscount.code})
                <Badge variant="secondary" className="text-xs">
                  {appliedDiscount.valueType === 'percentage'
                    ? `${appliedDiscount.value}% off`
                    : `GHS ${appliedDiscount.value} off`}
                </Badge>
              </span>
              <span>-GHS {discountAmount.toFixed(2)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>GHS {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PaystackButton
        email={email}
        amount={total}
        metadata={metadata}
        onSuccess={onSuccess}
        onClose={onClose}
        isProcessing={isProcessing}
        isValid={isValid}
      />
    </Card>
  );
}
