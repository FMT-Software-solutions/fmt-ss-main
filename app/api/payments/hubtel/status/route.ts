import { issuesServer } from '@/services/issues/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const statusSchema = z.object({
    clientReference: z.string().min(1),
});

const parseJsonResponse = async (response: Response) => {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = statusSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'clientReference is required' },
                { status: 400 }
            );
        }

        const { clientReference } = validation.data;

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

        const basicAuth = Buffer.from(`${apiId}:${apiKey}`).toString('base64');
        const statusUrl = `https://rmsc.hubtel.com/v1/merchantaccount/merchants/${merchantAccount}/transactions/status?clientReference=${encodeURIComponent(
            clientReference
        )}`;

        const response = await fetch(statusUrl, {
            headers: {
                Authorization: `Basic ${basicAuth}`,
            },
        });

        const data = await parseJsonResponse(response);

        if (!response.ok) {
            await issuesServer.logApiError(
                'Hubtel status check failed',
                '/api/payments/hubtel/status',
                'POST',
                {
                    clientReference,
                    status: response.status,
                    data,
                }
            );
        }

        return NextResponse.json({
            ok: response.ok,
            status: response.status,
            data,
        });
    } catch (error) {
        await issuesServer.logApiError(
            error instanceof Error ? error.message : 'Hubtel status check error',
            '/api/payments/hubtel/status',
            'POST'
        );
        return NextResponse.json(
            { error: 'Invalid request payload' },
            { status: 400 }
        );
    }
}
