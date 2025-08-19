'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Tag } from 'lucide-react';
import { IDiscountCode } from '@/types/premium-app';

interface DiscountCodeInputProps {
  discountCodes: IDiscountCode[];
  onCodeApplied: (code: IDiscountCode) => void;
  onCodeRemoved: () => void;
  appliedCode?: IDiscountCode;
  originalPrice: number;
}

export default function DiscountCodeInput({
  discountCodes,
  onCodeApplied,
  onCodeRemoved,
  appliedCode,
  originalPrice,
}: DiscountCodeInputProps) {
  const [inputCode, setInputCode] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateAndApplyCode = async () => {
    if (!inputCode.trim()) {
      setValidationMessage('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    // Find the discount code
    const foundCode = discountCodes.find(
      (code) => code.code.toLowerCase() === inputCode.toLowerCase().trim()
    );

    if (!foundCode) {
      setValidationMessage('Invalid discount code');
      setIsValidating(false);
      return;
    }

    // Check if code is active
    if (!foundCode.isActive) {
      setValidationMessage('This discount code is no longer active');
      setIsValidating(false);
      return;
    }

    // Check if code has expired
    if (foundCode.validityPeriod?.endDate && new Date(foundCode.validityPeriod.endDate) < new Date()) {
      setValidationMessage('This discount code has expired');
      setIsValidating(false);
      return;
    }

    // Check usage limits
    if (foundCode.usageLimit?.enabled && foundCode.usageLimit.totalUses && foundCode.usageLimit.totalUses > 0) {
      // TODO: Implement actual usage tracking when user system is ready
      // For now, we'll skip this check
    }

    // Code is valid, apply it
    onCodeApplied(foundCode);
    setInputCode('');
    setValidationMessage('Discount code applied successfully!');
    setIsValidating(false);
  };

  const removeCode = () => {
    onCodeRemoved();
    setValidationMessage('');
    setInputCode('');
  };

  const calculateDiscount = (code: IDiscountCode) => {
    if (code.valueType === 'percentage') {
      return (originalPrice * code.value) / 100;
    } else {
      return Math.min(code.value, originalPrice);
    }
  };

  const getDiscountText = (code: IDiscountCode) => {
    if (code.valueType === 'percentage') {
      return `${code.value}% OFF`;
    } else {
      return `$${code.value} OFF`;
    }
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Have a discount code?</span>
          </div>

          {appliedCode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Code "{appliedCode.code}" applied
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {getDiscountText(appliedCode)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeCode}
                  className="text-green-600 hover:text-green-700 h-auto p-1"
                >
                  Remove
                </Button>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                You save ${calculateDiscount(appliedCode).toFixed(2)} with this code!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter discount code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateAndApplyCode()}
                  className="flex-1"
                />
                <Button
                  onClick={validateAndApplyCode}
                  disabled={isValidating || !inputCode.trim()}
                  size="sm"
                >
                  {isValidating ? 'Validating...' : 'Apply'}
                </Button>
              </div>

              {validationMessage && (
                <div className={`flex items-center gap-2 text-sm ${
                  validationMessage.includes('successfully') 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {validationMessage.includes('successfully') ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {validationMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}