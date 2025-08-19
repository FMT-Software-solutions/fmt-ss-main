'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, X } from 'lucide-react';
import { DiscountCode, CheckoutState } from '../../types/cart';
import { toast } from 'sonner';
import { getDiscountCodeByCode, getActiveDiscountCodes } from '@/sanity/lib/discount-queries';
import { validateDiscountCode as validateDiscount, canStackWithPromotions } from '@/lib/discount-utils';
import { IPremiumApp } from '@/types/premium-app';

interface DiscountCodeFormProps {
  checkoutState: CheckoutState;
  cartItems: IPremiumApp[];
  onDiscountApplied: (
    discount: DiscountCode | null,
    discountAmount: number
  ) => void;
  disabled?: boolean;
}



export function DiscountCodeForm({
  checkoutState,
  cartItems,
  onDiscountApplied,
  disabled = false,
}: DiscountCodeFormProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<DiscountCode[]>([]);

  // Load available discount codes on component mount
  useEffect(() => {
    const loadAvailableCodes = async () => {
      try {
        const codes = await getActiveDiscountCodes();
        // Filter codes that can be stacked with current promotions
        const stackableCodes = codes.filter(code => canStackWithPromotions(code, cartItems));
        setAvailableCodes(stackableCodes.slice(0, 5)); // Show only first 5 codes
      } catch (error) {
        console.error('Error loading discount codes:', error);
      }
    };

    loadAvailableCodes();
  }, [cartItems]);

  const validateDiscountCodeInput = async (
    code: string
  ): Promise<DiscountCode | null> => {
    try {
      const discountCode = await getDiscountCodeByCode(code);
      return discountCode;
    } catch (error) {
      console.error('Error validating discount code:', error);
      return null;
    }
  };



  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    try {
      const discount = await validateDiscountCodeInput(discountCode.trim());

      if (!discount) {
        toast.error('Invalid or expired discount code');
        return;
      }

      // Check if discount can be stacked with promotions
      if (!canStackWithPromotions(discount, cartItems)) {
        toast.error(
          'This discount code cannot be applied when items have active promotions'
        );
        return;
      }

      // Validate discount against cart items
      const validationResult = validateDiscount(discount, cartItems);

      if (!validationResult.isValid) {
        toast.error(validationResult.errorMessage || 'Invalid discount code');
        return;
      }

      onDiscountApplied(discount, validationResult.totalDiscount);
      toast.success(
        `Discount code applied! You saved GHS ${validationResult.totalDiscount.toFixed(2)}`
      );
    } catch (error) {
      toast.error('Error validating discount code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied(null, 0);
    setDiscountCode('');
    toast.success('Discount code removed');
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Discount Code</h3>

      {checkoutState.appliedDiscount ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  {checkoutState.appliedDiscount.code}
                </p>
                <p className="text-sm text-green-600">
                  You saved GHS {checkoutState.discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveDiscount}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              disabled={
                disabled || checkoutState.hasActivePromotions || isValidating
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyDiscount();
                }
              }}
            />
            <Button
              onClick={handleApplyDiscount}
              disabled={
                disabled ||
                checkoutState.hasActivePromotions ||
                isValidating ||
                !discountCode.trim()
              }
              variant="outline"
            >
              {isValidating ? 'Validating...' : 'Apply'}
            </Button>
          </div>

          {availableCodes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Available codes:</p>
              <div className="flex flex-wrap gap-1">
                {availableCodes.map((code) => (
                  <Badge
                    key={code.code}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() =>
                      !disabled &&
                      setDiscountCode(code.code)
                    }
                  >
                    {code.code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
