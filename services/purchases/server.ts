import { createServiceClient } from '@/lib/supabase/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { appsProvisioningDetailsByIdsQuery } from '@/sanity/lib/queries';

export interface BillingDetails {
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
}

export interface PurchaseItemInput {
  productId: string;
  quantity: number;
  price?: number;
  appId?: string;
  title?: string;
  product?: { price?: number; slug?: string } | null;
}

export interface AppProvisioningInput {
  [key: string]: {
    useSameEmailAsAdmin: boolean;
    userEmail?: string;
  };
}

export interface ProvisioningAppDetail {
  _id: string;
  title: string;
  platforms?: Record<string, any>;
  appProvisioning?: Record<string, any>;
}

export const buildPurchaseItems = (items: PurchaseItemInput[]) =>
  items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.product?.price ?? item.price ?? 0,
    appId: item.product?.slug ?? item.appId ?? item.productId,
  }));

export const ensureOrganizationAndBillingAddress = async ({
  supabase,
  billingDetails,
  isExistingOrg,
}: {
  supabase: ReturnType<typeof createServiceClient>;
  billingDetails: BillingDetails;
  isExistingOrg: boolean;
}) => {
  let organizationId = '';

  if (isExistingOrg) {
    const { data: existingOrg, error: orgLookupError } = await supabase
      .from('organizations')
      .select('id, name, email, phone')
      .eq('email', billingDetails.organizationEmail)
      .maybeSingle();

    if (orgLookupError) {
      throw new Error(orgLookupError.message);
    }

    if (existingOrg?.id) {
      organizationId = existingOrg.id;
      const updates: Record<string, any> = {};

      if (billingDetails.organizationName !== existingOrg.name) {
        updates.name = billingDetails.organizationName;
      }

      if (billingDetails.organizationEmail !== existingOrg.email) {
        updates.email = billingDetails.organizationEmail;
      }

      if (billingDetails.phoneNumber && billingDetails.phoneNumber !== existingOrg.phone) {
        updates.phone = billingDetails.phoneNumber;
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('organizations').update(updates).eq('id', organizationId);
      }
    }
  }

  if (!organizationId) {
    const { data: newOrg, error: orgCreateError } = await supabase
      .from('organizations')
      .insert({
        name: billingDetails.organizationName,
        email: billingDetails.organizationEmail,
        phone: billingDetails.phoneNumber,
        status: 'active',
        verificationStatus: 'pending',
        address: {},
      })
      .select()
      .single();

    if (orgCreateError) {
      throw new Error(orgCreateError.message);
    }

    organizationId = newOrg.id;
  }

  if (organizationId) {
    const { data: existingAddresses } = await supabase
      .from('billing_addresses')
      .select('*')
      .eq('organization_id', organizationId);

    const addressExists = existingAddresses?.some(
      (addr) =>
        addr.street === billingDetails.address.street &&
        addr.city === billingDetails.address.city &&
        addr.state === billingDetails.address.state &&
        addr.country === billingDetails.address.country &&
        addr.postalCode === billingDetails.address.postalCode
    );

    if (!addressExists) {
      await supabase.from('billing_addresses').insert({
        organization_id: organizationId,
        street: billingDetails.address.street,
        city: billingDetails.address.city,
        state: billingDetails.address.state,
        country: billingDetails.address.country,
        postalCode: billingDetails.address.postalCode,
        isDefault: !existingAddresses || existingAddresses.length === 0,
      });
    }
  }

  return organizationId;
};

export const createPurchaseRecordServer = async ({
  supabase,
  organizationId,
  clientReference,
  amount,
  status,
  items,
  paymentProvider,
  paymentMethod,
  externalTransactionId,
  paymentDetails,
}: {
  supabase: ReturnType<typeof createServiceClient>;
  organizationId: string;
  clientReference: string;
  amount: number;
  status: string;
  items: PurchaseItemInput[];
  paymentProvider?: string | null;
  paymentMethod?: string | null;
  externalTransactionId?: string | null;
  paymentDetails?: Record<string, any> | null;
}) => {
  const { data: createdPurchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      organization_id: organizationId,
      payment_reference: clientReference,
      amount,
      status,
      items: buildPurchaseItems(items),
      payment_provider: paymentProvider,
      payment_method: paymentMethod,
      external_transaction_id: externalTransactionId,
      payment_details: paymentDetails,
    })
    .select('id, status, organization_id, items, amount')
    .single();

  if (purchaseError) {
    throw new Error(purchaseError.message);
  }

  return createdPurchase;
};

export const fetchProvisioningAppsByIds = async (productIds: string[]) => {
  if (productIds.length === 0) {
    return [];
  }
  return sanityClient.fetch<ProvisioningAppDetail[]>(
    appsProvisioningDetailsByIdsQuery,
    { ids: productIds }
  );
};

export const buildProvisioningDetails = (
  apps: ProvisioningAppDetail[],
  appProvisioningDetails: AppProvisioningInput
) =>
  apps.reduce((acc: Record<string, any>, app) => {
    acc[app._id] = {
      id: app._id,
      name: app.title,
      ...appProvisioningDetails[app._id],
      ...app.appProvisioning,
      platforms: app.platforms || {},
      webAppUrl: app.platforms?.web?.webAppUrl || '',
    };
    return acc;
  }, {});

export const buildProvisioningDrafts = (
  apps: ProvisioningAppDetail[],
  billingDetails: BillingDetails
) =>
  apps.reduce((acc: Record<string, any>, app) => {
    acc[app._id] = {
      productId: app._id,
      name: app.title,
      useSameEmailAsAdmin: true,
      userEmail: billingDetails.organizationEmail,
    };
    return acc;
  }, {});

export const triggerAppProvisioning = async ({
  origin,
  organizationId,
  billingDetails,
  appProvisioningDetails,
}: {
  origin: string;
  organizationId: string;
  billingDetails: BillingDetails;
  appProvisioningDetails: Record<string, any>;
}) =>
  fetch(`${origin}/api/app-provisioning`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizationId,
      billingDetails,
      appProvisioningDetails,
    }),
  });

export const sendPurchaseConfirmationEmail = async ({
  origin,
  billingDetails,
  items,
  total,
}: {
  origin: string;
  billingDetails: BillingDetails;
  items: PurchaseItemInput[];
  total: number;
}) =>
  fetch(`${origin}/api/purchases/confirmation-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizationDetails: {
        organizationName: billingDetails.organizationName || '',
        organizationEmail: billingDetails.organizationEmail,
      },
      items,
      total,
    }),
  });
