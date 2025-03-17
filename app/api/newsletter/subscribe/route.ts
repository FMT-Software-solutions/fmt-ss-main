import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import NewsletterWelcomeEmail from '@/emails/NewsletterWelcome';
import { z } from 'zod';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting map to prevent abuse
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // Max 3 requests per minute

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;

    if (now - lastRequest < RATE_LIMIT_WINDOW) {
      rateLimitMap.set(ip, now);
      const requestCount = (rateLimitMap.get(`${ip}:count`) || 0) + 1;
      rateLimitMap.set(`${ip}:count`, requestCount);

      if (requestCount > MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      // Reset count after window expires
      rateLimitMap.set(ip, now);
      rateLimitMap.set(`${ip}:count`, 1);
    }

    // Parse request body
    const body = await request.json();

    // Validate email
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Initialize Supabase client
    const supabase = await createClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter.' },
        { status: 200 }
      );
    }

    // Generate a unique token for unsubscribing
    const unsubscribeToken = crypto.randomUUID();

    // Add email to database
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          unsubscribe_token: unsubscribeToken,
        },
      ]);

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // Generate unsubscribe URL
    const unsubscribeUrl = `${request.nextUrl.origin}/newsletter/unsubscribe?token=${unsubscribeToken}`;

    // Send welcome email using Resend with React components
    const { error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to FMT Software Solutions Newsletter',
      react: NewsletterWelcomeEmail({
        email,
        unsubscribeUrl,
      }),
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      // We don't return an error here since the user is already subscribed
      // Just log the error and continue
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
