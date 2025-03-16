'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useActionState } from 'react';

// In React 19, we can use the useActionState hook for form handling
export default function NewsletterSection() {
  // Using React 19's useActionState hook for form handling
  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Here you would normally send the email to your API
        const email = formData.get('email');
        console.log('Subscribed email:', email);

        return null; // No error
      } catch (err) {
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
