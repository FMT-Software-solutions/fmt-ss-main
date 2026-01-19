'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

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

const HubtelCheckoutButtonClient = dynamic(
  () =>
    import('./HubtelCheckoutButtonClient').then(
      (mod) => mod.HubtelCheckoutButtonClient
    ),
  {
    ssr: false,
    loading: () => <LoadingButton />,
  }
);

export function HubtelCheckoutButton(props: HubtelPaymentProps) {
  return <HubtelCheckoutButtonClient {...props} />;
}
