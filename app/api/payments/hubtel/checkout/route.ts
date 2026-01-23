import { createServiceClient } from '@/lib/supabase/server';
import { issuesServer } from '@/services/issues/server';
import {
  buildProvisioningDetails,
  createPurchaseRecordServer,
  ensureOrganizationAndBillingAddress,
  fetchProvisioningAppsByIds,
  sendPurchaseConfirmationEmail,
  triggerAppProvisioning,
} from '@/services/purchases/server';
import { NextResponse } from 'next/server';

type HubtelCheckoutPayload = {
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
    product?: { price?: number; slug?: string } | null;
  }>;
  total: number;
  isExistingOrg: boolean;
  appProvisioningDetails: Record<string, { useSameEmailAsAdmin: boolean; userEmail?: string }>;
};

type HubtelSuccessPayload = Record<string, any>;

const getPurchaseStatus = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (!normalized) {
    return 'pending';
  }
  if (['paid', 'success', 'successful', 'completed'].includes(normalized)) {
    return 'completed';
  }
  if (
    ['unpaid', 'failed', 'declined', 'canceled', 'cancelled', 'reversed'].includes(
      normalized
    )
  ) {
    return 'failed';
  }
  return 'pending';
};

const safeJsonParse = (value?: string | null) => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeSuccessPayload = (payload?: HubtelSuccessPayload | null) => {
  if (!payload) {
    return {
      status: 'pending',
      paymentMethod: null,
      externalTransactionId: null,
      parsedData: null,
      clientSuccessPayload: null,
    };
  }
  const dataObject = payload.data && typeof payload.data === 'object' ? payload.data : null;
  const dataString = typeof payload.data === 'string' ? payload.data : null;
  const parsedData = safeJsonParse(dataString);
  const statusCandidate =
    dataObject?.status ||
    dataObject?.Status ||
    parsedData?.status ||
    parsedData?.Status ||
    payload.status ||
    payload.Status ||
    null;
  const responseCode = payload.responseCode || payload.ResponseCode;
  const successStatus = payload.success === true ? 'paid' : undefined;
  const responseCodeStatus = responseCode === '0000' ? 'paid' : undefined;
  const status = getPurchaseStatus(statusCandidate || successStatus || responseCodeStatus);
  const paymentMethod =
    dataObject?.paymentMethod ||
    dataObject?.PaymentMethod ||
    parsedData?.paymentMethod ||
    parsedData?.PaymentMethod ||
    payload.paymentMethod ||
    payload.PaymentMethod ||
    null;
  const externalTransactionId =
    dataObject?.externalTransactionId ||
    dataObject?.ExternalTransactionId ||
    parsedData?.externalTransactionId ||
    parsedData?.ExternalTransactionId ||
    payload.externalTransactionId ||
    payload.ExternalTransactionId ||
    null;

  return {
    status,
    paymentMethod,
    externalTransactionId,
    parsedData,
    clientSuccessPayload: payload,
  };
};

const resolveStatus = (existingStatus: string | null, incomingStatus: string) => {
  if (incomingStatus === 'completed') {
    return 'completed';
  }
  if (incomingStatus === 'failed') {
    return 'failed';
  }
  return existingStatus || incomingStatus;
};

const mergePaymentDetails = (
  existingDetails: Record<string, any> | null | undefined,
  updates: {
    clientSuccessPayload: HubtelSuccessPayload | null;
    parsedData: Record<string, any> | null;
  }
) => {
  const current = existingDetails || {};
  return {
    ...current,
    clientSuccess: updates.clientSuccessPayload ?? current.clientSuccess ?? null,
    statusCheck: updates.parsedData ?? current.statusCheck ?? null,
    updatedAt: new Date().toISOString(),
  };
};

export async function POST(request: Request) {
  let body: {
    clientReference?: string;
    checkoutPayload?: HubtelCheckoutPayload;
    paymentResponse?: HubtelSuccessPayload;
  } | null = null;
  try {
    body = await request.json();
    const { clientReference, checkoutPayload, paymentResponse } = body || {};
    const normalized = normalizeSuccessPayload(paymentResponse);

    if (
      !clientReference ||
      !checkoutPayload?.billingDetails ||
      !checkoutPayload?.items ||
      checkoutPayload.items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (normalized.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment not completed', status: normalized.status },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data: existingPurchase, error: existingError } = await supabase
      .from('purchases')
      .select(
        'id, status, organization_id, items, amount, payment_details, payment_method, external_transaction_id'
      )
      .eq('payment_reference', clientReference)
      .maybeSingle();

    if (existingError) {
      await issuesServer.logDatabaseError(
        existingError.message,
        'hubtel_checkout_fetch_purchase',
        'purchases',
        undefined,
        { clientReference }
      );
      return NextResponse.json(
        { error: 'Failed to lookup purchase' },
        { status: 500 }
      );
    }

    if (existingPurchase) {
      const mergedPaymentDetails = mergePaymentDetails(existingPurchase.payment_details, {
        clientSuccessPayload: normalized.clientSuccessPayload,
        parsedData: normalized.parsedData,
      });
      const resolvedStatus = resolveStatus(existingPurchase.status, normalized.status);
      const { error: updateError } = await supabase
        .from('purchases')
        .update({
          status: resolvedStatus,
          payment_provider: 'hubtel',
          payment_reference: clientReference,
          payment_method: normalized.paymentMethod ?? existingPurchase.payment_method,
          external_transaction_id:
            normalized.externalTransactionId ?? existingPurchase.external_transaction_id,
          payment_details: mergedPaymentDetails,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPurchase.id);

      if (updateError) {
        await issuesServer.logDatabaseError(
          updateError.message,
          'hubtel_checkout_update_purchase',
          'purchases',
          undefined,
          { clientReference }
        );
        return NextResponse.json(
          { error: 'Failed to update purchase' },
          { status: 500 }
        );
      }
      return NextResponse.json({ received: true, matched: true, status: resolvedStatus });
    }

    const billingDetails = checkoutPayload.billingDetails;
    const items = checkoutPayload.items || [];
    const appProvisioningDetails = checkoutPayload.appProvisioningDetails || {};
    let organizationId = '';

    try {
      organizationId = await ensureOrganizationAndBillingAddress({
        supabase,
        billingDetails,
        isExistingOrg: checkoutPayload.isExistingOrg,
      });
    } catch (orgError) {
      await issuesServer.logDatabaseError(
        orgError instanceof Error ? orgError.message : 'Organization update failed',
        'hubtel_checkout_org_sync',
        'organizations',
        undefined,
        { clientReference }
      );
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    const mergedPaymentDetails = mergePaymentDetails(null, {
      clientSuccessPayload: normalized.clientSuccessPayload,
      parsedData: normalized.parsedData,
    });

    let createdPurchase;
    try {
      createdPurchase = await createPurchaseRecordServer({
        supabase,
        organizationId,
        clientReference,
        amount: checkoutPayload.total,
        status: normalized.status,
        items,
        paymentProvider: 'hubtel',
        paymentMethod: normalized.paymentMethod,
        externalTransactionId: normalized.externalTransactionId,
        paymentDetails: mergedPaymentDetails,
      });
    } catch (purchaseError) {
      await issuesServer.logDatabaseError(
        purchaseError instanceof Error ? purchaseError.message : 'Purchase create failed',
        'hubtel_checkout_create_purchase',
        'purchases',
        undefined,
        { clientReference }
      );
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      );
    }

    if (billingDetails?.organizationEmail) {
      const origin = new URL(request.url).origin;
      try {
        await sendPurchaseConfirmationEmail({
          origin,
          billingDetails,
          items,
          total: checkoutPayload.total,
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

    if (Object.keys(appProvisioningDetails).length > 0) {
      try {
        const productIds = items.map((item) => item.productId);
        const appsWithProvisionDetails = await fetchProvisioningAppsByIds(productIds);
        const provisioningDetails = buildProvisioningDetails(
          appsWithProvisionDetails,
          appProvisioningDetails
        );

        const origin = new URL(request.url).origin;
        await triggerAppProvisioning({
          origin,
          organizationId,
          billingDetails,
          appProvisioningDetails: provisioningDetails,
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

    return NextResponse.json({
      received: true,
      matched: true,
      status: createdPurchase.status,
    });
  } catch (error) {
    await issuesServer.logApiError(
      error instanceof Error ? error.message : 'Hubtel checkout failure',
      '/api/payments/hubtel/checkout',
      'POST',
      { payload: body }
    );
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
