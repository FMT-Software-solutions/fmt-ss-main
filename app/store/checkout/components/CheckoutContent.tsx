'use client';

import { useCartStore } from '../../store/cart';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  organizationDetailsSchema,
  OrganizationDetails,
} from '../../types/cart';
import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { createPurchaseRecord } from '../../services/purchases';
import { getOrganizationByEmail } from '../../services/organizations';
import { toast } from 'sonner';
import { EmailStep } from './EmailStep';
import { OrganizationDetailsForm } from './OrganizationDetailsForm';
import { OrderSummary } from './OrderSummary';
import { BillingAddress } from '@/types/organization';

export default function CheckoutContent() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [isExistingOrg, setIsExistingOrg] = useState(false);
  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>(
    []
  );

  const form = useForm<OrganizationDetails>({
    resolver: zodResolver(organizationDetailsSchema),
    defaultValues: {
      organizationName: '',
      organizationEmail: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
    },
  });

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

  const lookupOrganization = async (email: string) => {
    try {
      setIsLoadingOrg(true);
      const org = await getOrganizationByEmail(email);

      if (org) {
        setIsExistingOrg(true);
        setBillingAddresses(org.billingAddresses);

        // Pre-fill form with organization details
        form.reset({
          organizationName: org.name,
          organizationEmail: org.email,
          phoneNumber: org.phone || '',
          address: org.billingAddresses[0]
            ? {
                street: org.billingAddresses[0].street,
                city: org.billingAddresses[0].city,
                state: org.billingAddresses[0].state,
                country: org.billingAddresses[0].country,
                postalCode: org.billingAddresses[0].postalCode || '',
              }
            : {
                street: '',
                city: '',
                state: '',
                country: '',
                postalCode: '',
              },
        });
        toast.success('Organization details loaded successfully');
      } else {
        setIsExistingOrg(false);
        setBillingAddresses([]);
        // If no organization found, just set the email
        form.setValue('organizationEmail', email);
      }

      setStep('details');
    } catch (error) {
      console.error('Error looking up organization:', error);
      toast.error('Failed to lookup organization details');
    } finally {
      setIsLoadingOrg(false);
    }
  };

  const handlePaymentSuccess = async (reference: any) => {
    try {
      setIsProcessing(true);

      const result = await createPurchaseRecord(
        form.getValues(),
        items,
        total,
        reference.reference,
        isExistingOrg
      );

      // Show appropriate success message
      if (!isExistingOrg) {
        toast.success(
          'Purchase successful! We have created an account for you. Please check your email for login details.',
          { duration: 6000 }
        );
      } else {
        toast.success('Purchase successful! Thank you for your order.', {
          duration: 4000,
        });
      }

      clearCart();
      router.push('/store/checkout/success');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(
        'There was an error processing your payment. Please contact support.'
      );
      setIsProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
  };

  if (step === 'email') {
    return (
      <EmailStep
        defaultEmail={form.getValues('organizationEmail')}
        isLoadingOrg={isLoadingOrg}
        onSubmit={lookupOrganization}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground">
          {isExistingOrg
            ? 'Review your organization details and complete your purchase.'
            : 'Complete your purchase by providing your organization details.'}
        </p>
        {isExistingOrg ? (
          <p className="text-sm text-muted-foreground mt-2">
            Organization details can be updated from your dashboard after
            purchase.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            We'll create an account for you with these details. Login
            credentials will be sent to your email.
          </p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <OrganizationDetailsForm
          form={form}
          isExistingOrg={isExistingOrg}
          billingAddresses={billingAddresses}
        />

        <div className="space-y-4">
          <OrderSummary
            items={items}
            total={total}
            email={form.getValues('organizationEmail')}
            metadata={{
              name: form.getValues('organizationName'),
              phone: form.getValues('phoneNumber') || '',
              custom_fields: [],
            }}
            isProcessing={isProcessing}
            isValid={form.formState.isValid}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
          />
        </div>
      </div>
    </div>
  );
}
