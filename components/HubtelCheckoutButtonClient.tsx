'use client';

import { Button } from '@/components/ui/button';
import CheckoutSdk, { AllowedChannelsType } from '@hubteljs/checkout';
import { Loader2 } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { toast } from 'sonner';

interface HubtelPaymentProps {
  amount: number;
  customerPhoneNumber: string;
  purchaseDescription: string;
  clientReference?: string;
  checkoutPayload: {
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
    items: Array<{
      productId: string;
      quantity: number;
      product: any;
    }>;
    total: number;
    isExistingOrg: boolean;
    appProvisioningDetails: Record<
      string,
      { useSameEmailAsAdmin: boolean; userEmail?: string }
    >;
  };
  onSuccess: (reference: any) => void;
  onFailure?: (reference: any) => void;
  onClose: () => void;
  isProcessing?: boolean;
  isValid?: boolean;
}

const getOrderId = () => {
  return `FMT_${new Date().getTime()}`;
};

export function HubtelCheckoutButtonClient({
  amount,
  customerPhoneNumber,
  purchaseDescription,
  clientReference,
  checkoutPayload,
  onSuccess,
  onFailure,
  onClose,
  isProcessing = false,
  isValid = true,
}: HubtelPaymentProps) {
  const isReady = useMemo(() => typeof window !== 'undefined', []);
  const checkoutRef = useRef<CheckoutSdk | null>(null);

  const normalizePhoneNumber = (input: string) => {
    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length === 9) {
      return `+233${digitsOnly}`;
    }
    if (digitsOnly.length === 10 && digitsOnly.startsWith('0')) {
      return `+233${digitsOnly.slice(1)}`;
    }
    if (digitsOnly.length === 12 && digitsOnly.startsWith('233')) {
      return `+${digitsOnly}`;
    }
    return null;
  };

  const handlePayment = async () => {
    if (!isReady) {
      return;
    }
    const reference = clientReference || getOrderId();
    const normalizedPhone = normalizePhoneNumber(customerPhoneNumber || '');

    if (!normalizedPhone) {
      toast.error('Enter a valid Ghana phone number to continue.');
      return;
    }

    try {
      const response = await fetch('/api/payments/hubtel/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          purchaseDescription,
          customerPhoneNumber: normalizedPhone,
          clientReference: reference,
          checkoutPayload,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.config) {
        onFailure?.(result);
        return;
      }

      const resolvedReference = result.clientReference || reference;

      const allowedChannels: AllowedChannelsType[] = [
        'mobileMoney',
        'bankCard',
        'wallets',
      ];

      checkoutRef.current?.destroy();
      checkoutRef.current = new CheckoutSdk();
      checkoutRef.current.openModal({
        purchaseInfo: {
          amount,
          purchaseDescription,
          customerPhoneNumber: normalizedPhone,
          clientReference: resolvedReference,
        },
        config: {
          ...result.config,
          branding: 'enabled' as const,
          allowedChannels,
        },
        callBacks: {
          onPaymentSuccess: async (data) => {
            console.log('Payment success:', data);
            try {
              const checkoutResponse = await fetch(
                '/api/payments/hubtel/checkout',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    clientReference: resolvedReference,
                    checkoutPayload,
                    paymentResponse: data,
                  }),
                }
              );
              const checkoutResult = await checkoutResponse.json();
              if (!checkoutResponse.ok) {
                onFailure?.(checkoutResult);
                onClose();
                return;
              }
            } catch (error) {
              onFailure?.(error);
              onClose();
              return;
            }
            onSuccess({
              reference: resolvedReference,
              status: 'completed',
              method: 'hubtel',
            });
            onClose();
          },
          onPaymentFailure: (failure) => {
            onFailure?.(failure);
            onClose();
          },
          onClose: () => {
            onClose();
          },
        },
      });
    } catch (error) {
      onFailure?.(error);
      onClose();
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full"
      size="lg"
      disabled={!isValid || isProcessing || !isReady}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        `Pay GHS ${amount.toFixed(2)}`
      )}
    </Button>
  );
}
