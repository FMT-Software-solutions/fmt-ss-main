'use client';

import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { getCurrentPrice, isPromotionActive } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { appsProvisioningDetailsByIdsQuery } from '@/sanity/lib/queries';
import { issuesClient } from '@/services/issues/client';
import { BillingAddress } from '@/types/organization';
import { prodUrl } from '@/consts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getOrganizationForCheckout } from '../../services/organizations';
import { createPurchaseRecord } from '../../services/purchases';
import { useCartStore } from '../../store/cart';
import {
  CheckoutFormData,
  checkoutFormSchema,
  CheckoutState,
  DiscountCode,
} from '../../types/cart';
import { BillingAddressForm } from './BillingAddressForm';
import { DiscountCodeForm } from './DiscountCodeForm';
import { OrderSummary } from './OrderSummary';
import { OrganizationDetailsForm } from './OrganizationDetailsForm';
import { OrganizationSearch } from './OrganizationSearch';

export default function CheckoutContent() {
  const { items, total, clearCart, isLoading, loadCartItems } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExistingOrg, setIsExistingOrg] = useState(false);
  const [organizationEmail, setOrganizationEmail] = useState('');
  const [billingAddresses, setBillingAddresses] = useState<
    Pick<
      BillingAddress,
      | 'id'
      | 'street'
      | 'city'
      | 'state'
      | 'country'
      | 'postalCode'
      | 'isDefault'
    >[]
  >([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null
  );
  const [discountAmount, setDiscountAmount] = useState(0);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      billingDetails: {
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
      appProvisioningDetails: {},
      useSameDetailsForAll: false,
    },
  });

  // Load cart items on component mount
  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  // Watch for changes in useSameEmailAsAdmin checkbox and auto-populate userEmail
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name.includes('useSameEmailAsAdmin')) {
        const productId = name.split('.')[1];
        const isChecked =
          value.appProvisioningDetails?.[productId]?.useSameEmailAsAdmin;

        if (isChecked) {
          form.setValue(
            `appProvisioningDetails.${productId}.userEmail`,
            organizationEmail
          );
        } else {
          form.setValue(
            `appProvisioningDetails.${productId}.userEmail`,
            undefined
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, organizationEmail]);

  // Calculate checkout state with promotion detection
  const checkoutState: CheckoutState = useMemo(() => {
    // Only calculate if all items have product data loaded
    const allItemsLoaded = items.every((item) => item.product);

    if (!allItemsLoaded) {
      return {
        subtotal: 0,
        discountAmount: 0,
        finalTotal: 0,
        appliedDiscount: null,
        hasActivePromotions: false,
      };
    }

    const hasActivePromotions = items.some((item) => {
      if (!item.product) return false;
      return isPromotionActive(item.product);
    });

    const subtotal = items.reduce((sum, item) => {
      if (!item.product) return sum;
      const currentPrice = getCurrentPrice(item.product);
      return sum + currentPrice * item.quantity;
    }, 0);

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      subtotal,
      discountAmount,
      finalTotal,
      appliedDiscount,
      hasActivePromotions,
    };
  }, [items, discountAmount, appliedDiscount]);

  const isProd = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.location.origin === prodUrl;
  }, []);

  const displayTotal = isProd ? checkoutState.finalTotal : 1;

  const handleDiscountApplied = (
    discount: DiscountCode | null,
    amount: number
  ) => {
    setAppliedDiscount(discount);
    setDiscountAmount(amount);
  };

  // Check if cart items are still loading or don't have product data
  const isCartLoading =
    isLoading || (items.length > 0 && !items.every((item) => item.product));

  if (isCartLoading) {
    return (
      <div className="min-h-screen py-10">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Checkout</h1>
              <p className="text-muted-foreground">
                Loading your order details...
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add some premium apps to your cart to get started."
      >
        <Button onClick={() => router.push('/store')}>Browse Apps</Button>
      </EmptyState>
    );
  }

  const handleOrganizationFound = async (
    hasExistingOrg: boolean,
    email: string
  ) => {
    try {
      setOrganizationEmail(email);
      setIsExistingOrg(hasExistingOrg);

      if (hasExistingOrg) {
        const org = await getOrganizationForCheckout(email);
        if (org) {
          setBillingAddresses(org.billingAddresses);

          // Pre-fill billing details only (not exposing sensitive info)
          form.setValue('billingDetails', {
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
        } else {
          // Log when organization lookup fails
          await issuesClient.logCheckoutError(
            'Organization not found after successful search',
            'CheckoutContent',
            `Looking up organization details for email: ${email}`,
            { email, hasExistingOrg }
          );
        }
      } else {
        setBillingAddresses([]);
        // Set the email for new organizations
        form.setValue('billingDetails.organizationEmail', email);
      }

      // Initialize app provisioning details for each cart item
      const appProvisioningDetails: Record<string, any> = {};
      items.forEach((item) => {
        appProvisioningDetails[item.productId] = {
          userEmail: undefined,
          useSameEmailAsAdmin: false,
        };
      });
      form.setValue('appProvisioningDetails', appProvisioningDetails);

      // Allow form to validate naturally based on mode configuration

      setHasSearched(true);
    } catch (error) {
      // Log organization lookup error
      await issuesClient.logCheckoutError(
        error instanceof Error
          ? error
          : 'Unknown error during organization lookup',
        'CheckoutContent',
        `Processing organization details for email: ${email}`,
        {
          email,
          hasExistingOrg,
          error: error instanceof Error ? error.message : String(error),
        }
      );
      toast.error('Failed to process organization details');
    }
  };

  const handlePaymentSuccess = async (reference: any) => {
    const formData = form.getValues();

    try {
      if (reference?.method === 'hubtel') {
        toast.success(
          'Payment received. Your confirmation email will arrive shortly.',
          { duration: 5000 }
        );
        clearCart();
        router.push('/store/checkout/success');
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      const purchaseStatus =
        reference?.status === 'pending' ? 'pending' : 'completed';

      const result = await createPurchaseRecord(
        formData.billingDetails,
        items,
        checkoutState.finalTotal,
        reference.reference,
        isExistingOrg,
        purchaseStatus
      );

      if (purchaseStatus === 'pending') {
        return;
      }

      // Call app provisioning API for each app

      if (
        result?.status === 'completed' &&
        formData.appProvisioningDetails &&
        Object.keys(formData.appProvisioningDetails).length > 0
      ) {
        try {
          const productIds = items.map((item) => item.productId);
          const appsWithProvisionDetails = await client.fetch(
            appsProvisioningDetailsByIdsQuery,
            { ids: productIds }
          );

          const provisioningDetails = appsWithProvisionDetails.reduce(
            (acc: Record<string, any>, app: Record<string, any>) => {
              acc[app._id] = formData.appProvisioningDetails[app._id] = {
                id: app._id,
                name: app.title,
                ...formData.appProvisioningDetails[app._id],
                ...app.appProvisioning,
                platforms: app.platforms || {},
                webAppUrl: app.webAppUrl || '',
              };
              return acc;
            },
            {}
          );

          const provisioningResponse = await fetch('/api/app-provisioning', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              organizationId: result?.organization_id,
              billingDetails: formData.billingDetails,
              appProvisioningDetails: provisioningDetails,
            }),
          });

          const provisioningResult = await provisioningResponse.json();

          if (!provisioningResult.success) {
            console.error(
              'App provisioning errors:',
              provisioningResult.errors
            );
            // Still show success for purchase, but note provisioning issues
            toast.warning(
              `Purchase successful, but some apps may need manual setup. Support will contact you shortly.`,
              { duration: 8000 }
            );
          }
        } catch (provisioningError) {
          // Log app provisioning error
          await issuesClient.logCheckoutError(
            provisioningError instanceof Error
              ? provisioningError
              : 'Unknown error during app provisioning',
            'CheckoutContent',
            'Processing app provisioning after successful payment',
            {
              organizationId: result?.organization_id,
              organizationEmail: formData.billingDetails.organizationEmail,
              itemCount: items.length,
              error:
                provisioningError instanceof Error
                  ? provisioningError.message
                  : String(provisioningError),
            }
          );
          console.error('App provisioning failed:', provisioningError);
          toast.warning(
            `Purchase successful, but app setup encountered issues. Support will contact you shortly.`,
            { duration: 8000 }
          );
        }
      }

      // Show appropriate success message
      toast.success(
        'Purchase successful! Details will be sent to your email.',
        {
          duration: 4000,
        }
      );

      clearCart();
      router.push('/store/checkout/success');
    } catch (error) {
      // Log payment processing error
      await issuesClient.logCheckoutError(
        error instanceof Error
          ? error
          : 'Unknown error during payment processing',
        'CheckoutContent',
        'Processing payment success callback',
        {
          organizationEmail: formData.billingDetails.organizationEmail,
          itemCount: items.length,
          finalTotal: checkoutState.finalTotal,
          error: error instanceof Error ? error.message : String(error),
        }
      );
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

  const hubtelCheckoutPayload = {
    billingDetails: form.getValues('billingDetails'),
    items,
    total: checkoutState.finalTotal,
    isExistingOrg,
    appProvisioningDetails: form.getValues('appProvisioningDetails'),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground">
          {hasSearched
            ? isExistingOrg
              ? 'Review your details to complete your purchase.'
              : 'Complete your purchase by providing account and billing details.'
            : 'Enter organization/business email address.'}
        </p>
      </div>

      {!hasSearched ? (
        <OrganizationSearch
          onOrganizationFound={handleOrganizationFound}
          defaultEmail={organizationEmail}
          cartItems={items}
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <OrganizationDetailsForm
              form={form}
              fieldPrefix="billingDetails"
              isExistingOrg={isExistingOrg}
              cartItems={items}
            />

            <BillingAddressForm
              form={form}
              fieldPrefix="billingDetails"
              isExistingOrg={isExistingOrg}
              billingAddresses={billingAddresses}
            />
          </div>

          <div className="space-y-4">
            <DiscountCodeForm
              checkoutState={checkoutState}
              onDiscountApplied={handleDiscountApplied}
              disabled={isProcessing}
              cartItems={items.map((item) => item.product).filter(Boolean)}
            />

            <OrderSummary
              items={items}
              total={displayTotal}
              subtotal={checkoutState.subtotal}
              discountAmount={checkoutState.discountAmount}
              appliedDiscount={checkoutState.appliedDiscount}
              email={organizationEmail}
              hubtelCheckoutPayload={hubtelCheckoutPayload}
              metadata={{
                name: form.getValues('billingDetails.organizationName'),
                phone: form.getValues('billingDetails.phoneNumber') || '',
                custom_fields: [],
              }}
              isProcessing={isProcessing}
              isValid={form.formState.isValid}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
