'use client';

import { Card } from '@/components/ui/card';
import { CartItem } from '../../types/cart';
import { PaystackButton } from '@/components/PaystackButton';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
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
        {items.map((item: CartItem) => (
          <div key={item.productId} className="flex justify-between">
            <div>
              <p className="font-medium">{item.product.title}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              GHS {(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
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
