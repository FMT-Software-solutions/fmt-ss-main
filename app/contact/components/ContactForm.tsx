'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useActionState } from 'react';

// In React 19, we can use the useActionState hook for form handling
export default function ContactForm() {
  // Using React 19's useActionState hook for form handling
  const [error, submitAction, isPending] = useActionState(
    async (prevState: string | null, formData: FormData) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Here you would normally send the form data to your API
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        console.log('Form submitted:', { name, email, message });

        return null; // No error
      } catch (err) {
        return 'Failed to send message. Please try again.';
      }
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Using React 19's form action */}
        <form action={submitAction} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" name="message" required rows={5} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send Message'}
          </Button>

          {error && <p className="text-destructive mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
