import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { issuesServer } from '@/services/issues/server';
import {
  buildProvisioningDrafts,
  createPurchaseRecordServer,
  ensureOrganizationAndBillingAddress,
  fetchProvisioningAppsByIds,
} from '@/services/purchases/server';

const purchaseSchema = z.object({
  billingDetails: z.object({
    organizationName: z.string().min(1),
    organizationEmail: z.string().email(),
    phoneNumber: z.string().optional(),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().optional(),
    }),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative().optional(),
        title: z.string().optional(),
      })
    )
    .min(1),
  total: z.number().nonnegative(),
  isExistingOrg: z.boolean().optional(),
  clientReference: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});

const buildManualReference = (provided?: string) => {
  if (provided && provided.trim().length > 0) {
    return provided.trim();
  }
  return `FMT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = purchaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const supabase = createServiceClient();
    const clientReference = buildManualReference(payload.clientReference);

    const organizationId = await ensureOrganizationAndBillingAddress({
      supabase,
      billingDetails: payload.billingDetails,
      isExistingOrg: payload.isExistingOrg ?? false,
    });

    const createdPurchase = await createPurchaseRecordServer({
      supabase,
      organizationId,
      clientReference,
      amount: payload.total,
      status: payload.status ?? 'completed',
      items: payload.items,
      paymentProvider: 'manual',
      paymentMethod: 'manual',
      externalTransactionId: clientReference,
      paymentDetails: {
        manualEntry: true,
        enteredBy: 'admin',
      },
    });

    const productIds = payload.items.map((item) => item.productId);
    const apps = await fetchProvisioningAppsByIds(productIds);
    const provisioningDrafts = buildProvisioningDrafts(
      apps,
      payload.billingDetails
    );

    return NextResponse.json({
      success: true,
      purchase: createdPurchase,
      organizationId,
      clientReference,
      items: payload.items,
      provisioningDrafts,
      apps: apps.map((app) => ({ id: app._id, title: app.title })),
    });
  } catch (error) {
    await issuesServer.logApiError(
      error instanceof Error ? error.message : 'Manual purchase creation failed',
      '/api/admin/manual-purchases/create',
      'POST'
    );
    return NextResponse.json(
      { error: 'Failed to create purchase record' },
      { status: 500 }
    );
  }
}
