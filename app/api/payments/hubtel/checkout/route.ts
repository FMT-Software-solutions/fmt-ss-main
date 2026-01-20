import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      purchaseDescription,
      customerPhoneNumber,
      clientReference,
      checkoutPayload,
    } = body || {};

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

    if (
      !amount ||
      !purchaseDescription ||
      !customerPhoneNumber ||
      !clientReference ||
      !checkoutPayload?.billingDetails ||
      !checkoutPayload?.items ||
      checkoutPayload?.items?.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(customerPhoneNumber);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'Invalid Ghana phone number' },
        { status: 400 }
      );
    }

    const apiId = process.env.HUBTEL_API_ID || '';
    const apiKey = process.env.HUBTEL_API_KEY || '';
    const merchantAccountNumber =
      process.env.HUBTEL_MERCHANT_ACCOUNT ||
      process.env.NEXT_PUBLIC_HUBTEL_MERCHANT_ACCOUNT ||
      '';
    const merchantAccount = Number(merchantAccountNumber);

    if (!apiId || !apiKey || !merchantAccountNumber || Number.isNaN(merchantAccount)) {
      return NextResponse.json(
        { error: 'Hubtel configuration is missing' },
        { status: 500 }
      );
    }

    const origin =
      request.headers.get('origin') ||
      (request.headers.get('x-forwarded-host')
        ? `https://${request.headers.get('x-forwarded-host')}`
        : `http://${request.headers.get('host')}`);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
    const callbackUrl = `${baseUrl.replace(/\/$/, '')}/api/payments/hubtel/callback`;
    const basicAuth = Buffer.from(`${apiId}:${apiKey}`).toString('base64');

    const supabase = createServiceClient();
    const { error: sessionError } = await supabase
      .from('hubtel_checkout_sessions')
      .upsert(
        {
          client_reference: clientReference,
          billing_details: checkoutPayload.billingDetails,
          items: checkoutPayload.items,
          total: checkoutPayload.total,
          is_existing_org: checkoutPayload.isExistingOrg,
          app_provisioning_details: checkoutPayload.appProvisioningDetails || {},
          organization_email:
            checkoutPayload.billingDetails?.organizationEmail || null,
        },
        { onConflict: 'client_reference' }
      );

    if (sessionError) {
      return NextResponse.json(
        { error: 'Failed to store checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientReference,
      config: {
        merchantAccount,
        basicAuth,
        callbackUrl,
        integrationType: 'External',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
