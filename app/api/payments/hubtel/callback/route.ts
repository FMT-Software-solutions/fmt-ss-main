import { createServiceClient } from '@/lib/supabase/server';
import { issuesServer } from '@/services/issues/server';
import { NextResponse } from 'next/server';

type HubtelCallbackPayload = {
  message?: string;
  Message?: string;
  responseCode?: string;
  ResponseCode?: string;
  data?: Record<string, any> | string | null;
  Data?: Record<string, any> | null;
  success?: boolean;
  mobileNumber?: string;
  clientReference?: string;
  ClientReference?: string;
};

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

const normalizeCallbackPayload = (payload: HubtelCallbackPayload | null) => {
  if (!payload) {
    return null;
  }
  const payloadRecord = payload as Record<string, any>;
  const dataObject =
    payloadRecord.data && typeof payloadRecord.data === 'object'
      ? payloadRecord.data
      : null;
  const dataString = typeof payloadRecord.data === 'string' ? payloadRecord.data : null;
  const dataPascal =
    payloadRecord.Data && typeof payloadRecord.Data === 'object'
      ? payloadRecord.Data
      : null;
  const parsedData = safeJsonParse(dataString);

  const clientReference =
    payloadRecord.clientReference ||
    payloadRecord.ClientReference ||
    dataObject?.clientReference ||
    dataObject?.ClientReference ||
    dataPascal?.clientReference ||
    dataPascal?.ClientReference ||
    parsedData?.clientReference ||
    parsedData?.ClientReference ||
    null;

  const responseCode = payloadRecord.responseCode || payloadRecord.ResponseCode || null;
  const message = payloadRecord.message || payloadRecord.Message || null;

  const statusCandidate =
    dataObject?.status ||
    dataObject?.Status ||
    dataPascal?.status ||
    dataPascal?.Status ||
    parsedData?.status ||
    parsedData?.Status ||
    payloadRecord.status ||
    payloadRecord.Status ||
    null;

  const inferredStatus = responseCode === '0000' ? 'paid' : undefined;
  const status = getPurchaseStatus(statusCandidate || inferredStatus);

  const paymentMethod =
    dataObject?.paymentMethod ||
    dataObject?.PaymentMethod ||
    dataPascal?.paymentMethod ||
    dataPascal?.PaymentMethod ||
    parsedData?.paymentMethod ||
    parsedData?.PaymentMethod ||
    null;

  const externalTransactionId =
    dataObject?.externalTransactionId ||
    dataObject?.ExternalTransactionId ||
    dataPascal?.externalTransactionId ||
    dataPascal?.ExternalTransactionId ||
    parsedData?.externalTransactionId ||
    parsedData?.ExternalTransactionId ||
    null;

  const isClientSuccessPayload =
    typeof payloadRecord.success === 'boolean' || typeof payloadRecord.data === 'string';

  const hubtelCallbackPayload =
    payloadRecord.ResponseCode || payloadRecord.Data || payloadRecord.responseCode
      ? payload
      : null;

  const clientSuccessPayload = isClientSuccessPayload ? payload : null;

  return {
    clientReference,
    status,
    paymentMethod,
    externalTransactionId,
    parsedData,
    responseCode,
    message,
    hubtelCallbackPayload,
    clientSuccessPayload,
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
    hubtelCallbackPayload: HubtelCallbackPayload | null;
    clientSuccessPayload: HubtelCallbackPayload | null;
    parsedData: Record<string, any> | null;
    responseCode: string | null;
    message: string | null;
  }
) => {
  const current = existingDetails || {};
  return {
    ...current,
    hubtelCallback: updates.hubtelCallbackPayload ?? current.hubtelCallback ?? null,
    clientSuccess: updates.clientSuccessPayload ?? current.clientSuccess ?? null,
    statusCheck: updates.parsedData ?? current.statusCheck ?? null,
    responseCode: updates.responseCode ?? current.responseCode ?? null,
    message: updates.message ?? current.message ?? null,
    updatedAt: new Date().toISOString(),
  };
};

export async function POST(request: Request) {
  let payload: HubtelCallbackPayload | null = null;
  try {
    payload = await request.json();
    console.log(payload);
    const normalized = normalizeCallbackPayload(payload);
    const clientReference = normalized?.clientReference;

    if (!clientReference) {
      return NextResponse.json(
        { error: 'clientReference is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const status = normalized?.status;

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

    if (!existingPurchase) {
      await issuesServer.logApiError(
        'Purchase record not found for Hubtel callback',
        '/api/payments/hubtel/callback',
        'POST',
        { clientReference, payload }
      );
      return NextResponse.json({ received: true, matched: false, status });
    }

    const mergedPaymentDetails = mergePaymentDetails(
      existingPurchase.payment_details,
      {
        hubtelCallbackPayload: normalized.hubtelCallbackPayload,
        clientSuccessPayload: normalized.clientSuccessPayload,
        parsedData: normalized.parsedData,
        responseCode: normalized.responseCode,
        message: normalized.message,
      }
    );
    const resolvedStatus = resolveStatus(existingPurchase.status, status);
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

    return NextResponse.json({ received: true, matched: true, status: resolvedStatus });
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
