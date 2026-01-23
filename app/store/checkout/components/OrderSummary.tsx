'use client';

import { Card } from '@/components/ui/card';
import { CartItem, DiscountCode } from '../../types/cart';
import { PaystackButton } from '@/components/PaystackButton';
import { HubtelCheckoutButton } from '@/components/HubtelCheckoutButton';
import { getCurrentPrice, isPromotionActive } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  discountAmount: number;
  appliedDiscount: DiscountCode | null;
  email: string;
  hubtelCheckoutPayload: {
    billingDetails: {
      organizationName: string;
      organizationEmail: string;
      phoneNumber?: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode?: string;
      };
    };
    items: CartItem[];
    total: number;
    isExistingOrg: boolean;
    appProvisioningDetails: Record<
      string,
      { useSameEmailAsAdmin: boolean; userEmail?: string }
    >;
  };
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
  hubtelCheckoutPayload,
  metadata,
  isProcessing,
  isValid,
  onSuccess,
  onClose,
}: OrderSummaryProps) {
  const hubtelAvailable = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_HUBTEL_MERCHANT_ACCOUNT);
  }, []);
  const [selectedMethod, setSelectedMethod] = useState<'primary' | 'secondary'>(
    hubtelAvailable ? 'primary' : 'secondary'
  );

  const purchaseDescription = useMemo(() => {
    if (items.length === 1 && items[0]?.product?.title) {
      return `Payment for ${items[0].product.title}`;
    }
    return `Payment for ${items.length} items`;
  }, [items]);
  const handlePrimaryFailure = () => {
    toast.error(
      'Primary payment method failed. Please try the alternative method.'
    );
    setSelectedMethod('secondary');
    onClose();
  };

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

      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium">Payment Method</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => hubtelAvailable && setSelectedMethod('primary')}
            className={`w-full text-left border rounded-lg p-3 transition-colors ${
              selectedMethod === 'primary'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            } ${
              hubtelAvailable
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!hubtelAvailable}
          >
            <div className="flex items-center">
              <Image
                src="/momo.png"
                alt="MOMO payment"
                width={140}
                height={50}
              />
              <Image
                src="/card.png"
                alt="Card payment"
                width={70}
                height={50}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Primary payment method</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fast checkout with card or mobile money
            </p>

            <div className="flex justify-end">
              <Badge variant="secondary" className="text-xs">
                Recommended
              </Badge>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod('secondary')}
            className={`w-full text-left border rounded-lg p-3 transition-colors ${
              selectedMethod === 'secondary'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Alternative payment method</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this if the primary method is unavailable
            </p>
          </button>
        </div>
      </div>

      {selectedMethod === 'primary' && hubtelAvailable ? (
        <HubtelCheckoutButton
          amount={total}
          customerPhoneNumber={metadata.phone}
          purchaseDescription={purchaseDescription}
          checkoutPayload={hubtelCheckoutPayload}
          onSuccess={onSuccess}
          onFailure={handlePrimaryFailure}
          onClose={onClose}
          isProcessing={isProcessing}
          isValid={isValid}
        />
      ) : (
        <PaystackButton
          email={email}
          amount={total}
          metadata={metadata}
          onSuccess={onSuccess}
          onClose={onClose}
          isProcessing={isProcessing}
          isValid={isValid}
        />
      )}
    </Card>
  );
}
