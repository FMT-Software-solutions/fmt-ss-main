import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test data
    const testData = {
      organizationId: 'test-org-id',
      organizationDetails: {
        organizationName: 'Test Organization',
        organizationEmail: 'test@example.com',
        phoneNumber: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
          postalCode: '12345',
        },
      },
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          product: {
            title: 'Test Product',
            price: 100,
            downloadUrl: 'https://example.com/download',
            webAppUrl: 'https://example.com/app',
          },
        },
      ],
      total: 100,
    };

    // Call the edge function
    const { data, error } = await supabase.functions.invoke(
      'create-purchase-user',
      {
        body: testData,
      }
    );

    if (error) {
      console.error('Edge function error:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Edge function executed successfully',
      data,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
