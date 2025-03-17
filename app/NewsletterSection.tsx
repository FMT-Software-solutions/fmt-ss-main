'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useActionState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

// Email validation schema
const emailSchema = z.string().email('Please enter a valid email address');

// In React 19, we can use the useActionState hook for form handling
export default function NewsletterSection() {
  // Using React 19's useActionState hook for form handling
  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        const email = formData.get('email') as string;

        // Validate email
        try {
          emailSchema.parse(email);
        } catch (err) {
          if (err instanceof z.ZodError) {
            return err.errors[0].message;
          }
          return 'Please enter a valid email address';
        }

        // Send subscription request to API
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          return data.error || 'Failed to subscribe. Please try again.';
        }

        // Show success toast
        toast.success(
          data.message || 'Successfully subscribed to the newsletter!'
        );

        return null; // No error
      } catch (err) {
        console.error('Subscription error:', err);
        return 'Failed to subscribe. Please try again.';
      }
    },
    null
  );

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for updates on our public projects,
            custom software solutions, and upcoming training programs and
            events.
          </p>

          {/* Using React 19's form action */}
          <form action={submitAction} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <SubmitButton isPending={isPending} />
          </form>

          {error && <p className="text-destructive mt-2">{error}</p>}

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our privacy policy. We respect your
            privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
}

// Extracted button component using useFormStatus
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? 'Subscribing...' : 'Subscribe'}
    </Button>
  );
}
