'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { HookConfig } from 'react-paystack/dist/types';

interface PaystackPaymentProps {
  email: string;
  amount: number;
  metadata: {
    name: string;
    phone: string;
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  onSuccess: (reference: any) => void;
  onClose: () => void;
  isProcessing?: boolean;
  isValid?: boolean;
}

const getOrderId = () => {
  return `FMT_${new Date().getTime()}`;
};

export function PaystackButtonClient({
  email,
  amount,
  metadata,
  onSuccess,
  onClose,
  isProcessing = false,
  isValid = true,
}: PaystackPaymentProps) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const config: HookConfig = {
    reference: getOrderId(),
    email,
    amount: amount * 100, // Convert to GHS to pesewas
    publicKey,
    currency: 'GHS',
    label: metadata.name,
    phone: metadata.phone,
    firstname: metadata.name.split(' ')[0] || '',
    lastname: metadata.name.split(' ')[1] || '',
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: 'Name',
          variable_name: 'name',
          value: metadata.name,
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: metadata.phone,
        },
      ],
    },
    channels: ['mobile_money', 'card'], // Allow both mobile money and card payments
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!publicKey) {
      console.error('Paystack public key not initialized');
      return;
    }

    return initializePayment({
      onSuccess: (reference) => {
        onSuccess(reference);
      },
      onClose: () => {
        onClose();
      },
    });
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full"
      size="lg"
      disabled={!isValid || isProcessing || !publicKey}
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
