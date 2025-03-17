import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Token validation schema
const unsubscribeSchema = z.object({
  token: z.string().uuid('Invalid unsubscribe token'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Clean the token if it exists
    if (body.token) {
      body.token = body.token.trim();
    }

    // Validate token
    const result = unsubscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token format' },
        { status: 400 }
      );
    }

    const { token } = result.data;

    // Initialize Supabase client
    const supabase = await createClient();

    // Find subscriber by token
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('unsubscribe_token', token);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to process unsubscribe request. Please try again.' },
        { status: 500 }
      );
    }

    // Check if any subscribers were found
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token or already unsubscribed' },
        { status: 404 }
      );
    }

    // Delete subscriber from database
    const { error: deleteError } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('unsubscribe_token', token);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed from the newsletter' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
