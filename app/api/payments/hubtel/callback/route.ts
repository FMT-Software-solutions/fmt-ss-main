import { createServiceClient } from '@/lib/supabase/server';
import { client } from '@/sanity/lib/client';
import { appsProvisioningDetailsByIdsQuery } from '@/sanity/lib/queries';
import { issuesServer } from '@/services/issues/server';
import { NextResponse } from 'next/server';

type HubtelCallbackPayload = {
  message?: string;
  responseCode?: string;
  data?: {
    date?: string;
    status?: string;
    transactionId?: string;
    externalTransactionId?: string;
    paymentMethod?: string;
    clientReference?: string;
    currencyCode?: string | null;
    amount?: number;
    charges?: number;
    amountAfterCharges?: number;
    isFulfilled?: boolean | null;
  };
};

const getPurchaseStatus = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'paid') {
    return 'completed';
  }
  if (normalized === 'unpaid' || normalized === 'failed') {
    return 'failed';
  }
  return 'pending';
};

export async function POST(request: Request) {
  let payload: HubtelCallbackPayload | null = null;
  try {
    payload = await request.json();
    const clientReference = payload?.data?.clientReference;

    if (!clientReference) {
      return NextResponse.json(
        { error: 'clientReference is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const status = getPurchaseStatus(payload?.data?.status);

    const { data: session, error: sessionError } = await supabase
      .from('hubtel_checkout_sessions')
      .select('*')
      .eq('client_reference', clientReference)
      .maybeSingle();

    if (sessionError) {
      await issuesServer.logDatabaseError(
        sessionError.message,
        'hubtel_callback_fetch_session',
        'hubtel_checkout_sessions',
        undefined,
        { clientReference }
      );
    }

    const { data: existingPurchase, error: existingError } = await supabase
      .from('purchases')
      .select('id, status, organization_id, items, amount')
      .eq('payment_reference', clientReference)
      .maybeSingle();

    if (existingError) {
      await issuesServer.logDatabaseError(
        existingError.message,
        'hubtel_callback_fetch_purchase',
        'purchases',
        undefined,
        { clientReference }
      );
      return NextResponse.json(
        { error: 'Failed to lookup purchase' },
        { status: 500 }
      );
    }

    let purchaseRecord = existingPurchase || null;

    if (purchaseRecord) {
      const { data: updatedPurchase, error: updateError } = await supabase
        .from('purchases')
        .update({
          status,
          payment_provider: 'hubtel',
          payment_reference: clientReference,
          payment_method: payload?.data?.paymentMethod || null,
          external_transaction_id: payload?.data?.externalTransactionId || null,
          payment_details: payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseRecord.id)
        .select('id, status, organization_id, items, amount')
        .maybeSingle();

      if (updateError) {
        await issuesServer.logDatabaseError(
          updateError.message,
          'hubtel_callback_update_purchase',
          'purchases',
          undefined,
          {
            clientReference,
            payload,
          }
        );
        return NextResponse.json(
          { error: 'Failed to update purchase' },
          { status: 500 }
        );
      }
      purchaseRecord = updatedPurchase || purchaseRecord;
    } else if (status === 'completed' && session) {
      const billingDetails = session.billing_details;
      const items = session.items || [];
      const appProvisioningDetails = session.app_provisioning_details || {};

      let organizationId = '';

      if (session.is_existing_org) {
        const { data: existingOrg, error: orgLookupError } = await supabase
          .from('organizations')
          .select('id, name, email, phone')
          .eq('email', billingDetails.organizationEmail)
          .maybeSingle();

        if (orgLookupError) {
          await issuesServer.logDatabaseError(
            orgLookupError.message,
            'hubtel_callback_fetch_org',
            'organizations',
            undefined,
            { clientReference }
          );
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
          await issuesServer.logDatabaseError(
            orgCreateError.message,
            'hubtel_callback_create_org',
            'organizations',
            undefined,
            { clientReference }
          );
          return NextResponse.json(
            { error: 'Failed to create organization' },
            { status: 500 }
          );
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

      const { data: createdPurchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          organization_id: organizationId,
          payment_reference: clientReference,
          amount: session.total,
          status,
          items: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
            appId: item.product?.slug,
          })),
          payment_provider: 'hubtel',
          payment_method: payload?.data?.paymentMethod || null,
          external_transaction_id: payload?.data?.externalTransactionId || null,
          payment_details: payload,
        })
        .select('id, status, organization_id, items, amount')
        .single();

      if (purchaseError) {
        await issuesServer.logDatabaseError(
          purchaseError.message,
          'hubtel_callback_create_purchase',
          'purchases',
          undefined,
          { clientReference }
        );
        return NextResponse.json(
          { error: 'Failed to create purchase' },
          { status: 500 }
        );
      }

      purchaseRecord = createdPurchase;

      if (status === 'completed' && billingDetails?.organizationEmail) {
        const origin = new URL(request.url).origin;
        try {
          await fetch(`${origin}/api/purchases/confirmation-email`, {
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
              total: session.total,
            }),
          });
        } catch (emailError) {
          await issuesServer.logEmailError(
            emailError instanceof Error
              ? emailError.message
              : 'Failed to send purchase confirmation email',
            'hubtel_purchase_confirmation',
            billingDetails.organizationEmail,
            undefined,
            undefined,
            { clientReference }
          );
        }
      }

      if (status === 'completed' && Object.keys(appProvisioningDetails).length > 0) {
        try {
          const productIds = items.map((item: any) => item.productId);
          const appsWithProvisionDetails = await client.fetch(
            appsProvisioningDetailsByIdsQuery,
            { ids: productIds }
          );

          const provisioningDetails = appsWithProvisionDetails.reduce(
            (acc: Record<string, any>, app: Record<string, any>) => {
              acc[app._id] = {
                id: app._id,
                name: app.title,
                ...appProvisioningDetails[app._id],
                ...app.appProvisioning,
                platforms: app.platforms || {},
                webAppUrl: app.webAppUrl || '',
              };
              return acc;
            },
            {}
          );

          const origin = new URL(request.url).origin;
          await fetch(`${origin}/api/app-provisioning`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              organizationId,
              billingDetails,
              appProvisioningDetails: provisioningDetails,
            }),
          });
        } catch (provisioningError) {
          await issuesServer.logApiError(
            provisioningError instanceof Error
              ? provisioningError.message
              : 'Hubtel provisioning failed',
            '/api/app-provisioning',
            'POST',
            { clientReference }
          );
        }
      }
    } else {
      await issuesServer.logApiError(
        'Purchase record not found for Hubtel callback',
        '/api/payments/hubtel/callback',
        'POST',
        { clientReference, payload }
      );
      return NextResponse.json({ received: true, matched: false, status });
    }

    return NextResponse.json({ received: true, matched: true, status });
  } catch (error) {
    await issuesServer.logApiError(
      error instanceof Error ? error.message : 'Hubtel callback failure',
      '/api/payments/hubtel/callback',
      'POST',
      { payload }
    );
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
