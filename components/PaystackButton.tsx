'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Define the component props
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

// Generate a unique order ID
const getOrderId = () => {
  return `FMT_${new Date().getTime()}`;
};

// Create a placeholder component that will be shown during loading
const LoadingButton = ({
  isProcessing = false,
}: {
  isProcessing?: boolean;
}) => (
  <Button className="w-full" size="lg" disabled>
    {isProcessing ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing Payment...
      </>
    ) : (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading Payment...
      </>
    )}
  </Button>
);

// Create the actual client component with dynamic import
const PaystackButtonClient = dynamic(
  () =>
    import('./PaystackButtonClient').then((mod) => mod.PaystackButtonClient),
  {
    ssr: false,
    loading: () => <LoadingButton />,
  }
);

// Export a wrapper component that renders the dynamic component
export function PaystackButton(props: PaystackPaymentProps) {
  // On the server, or during SSR, this will return the placeholder
  // On the client, it will load the actual component
  return <PaystackButtonClient {...props} />;
}
