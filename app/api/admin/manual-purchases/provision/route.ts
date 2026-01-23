import { NextResponse } from 'next/server';
import { z } from 'zod';
import { issuesServer } from '@/services/issues/server';
import {
  buildProvisioningDetails,
  fetchProvisioningAppsByIds,
  triggerAppProvisioning,
} from '@/services/purchases/server';

const provisioningSchema = z.object({
  organizationId: z.string().min(1),
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
  appProvisioningDetails: z.record(
    z.object({
      useSameEmailAsAdmin: z.boolean(),
      userEmail: z.string().email().optional().or(z.literal('')),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = provisioningSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const appIds = Object.keys(payload.appProvisioningDetails);
    const apps = await fetchProvisioningAppsByIds(appIds);

    const normalizedDetails = Object.fromEntries(
      Object.entries(payload.appProvisioningDetails).map(([key, value]) => [
        key,
        {
          useSameEmailAsAdmin: value.useSameEmailAsAdmin,
          userEmail:
            value.userEmail && value.userEmail.length > 0
              ? value.userEmail
              : undefined,
        },
      ])
    );

    const provisioningDetails = buildProvisioningDetails(apps, normalizedDetails);
    const origin = new URL(request.url).origin;
    const response = await triggerAppProvisioning({
      origin,
      organizationId: payload.organizationId,
      billingDetails: payload.billingDetails,
      appProvisioningDetails: provisioningDetails,
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    await issuesServer.logApiError(
      error instanceof Error ? error.message : 'Manual provisioning failed',
      '/api/admin/manual-purchases/provision',
      'POST'
    );
    return NextResponse.json(
      { error: 'Failed to provision app' },
      { status: 500 }
    );
  }
}
