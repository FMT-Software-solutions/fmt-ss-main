import { NextResponse } from 'next/server';
import { z } from 'zod';
import { issuesServer } from '@/services/issues/server';
import { sendPurchaseConfirmationEmail } from '@/services/purchases/server';

const emailSchema = z.object({
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
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = emailSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const origin = new URL(request.url).origin;
        const payload = parsed.data;
        const response = await sendPurchaseConfirmationEmail({
            origin,
            billingDetails: payload.billingDetails,
            items: payload.items,
            total: payload.total,
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        await issuesServer.logApiError(
            error instanceof Error ? error.message : 'Manual email send failed',
            '/api/admin/manual-purchases/email',
            'POST'
        );
        return NextResponse.json(
            { error: 'Failed to send confirmation email' },
            { status: 500 }
        );
    }
}
