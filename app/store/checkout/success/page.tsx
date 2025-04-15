import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Confirmation | FMT Software Solutions',
  description:
    'Thank you for your purchase at FMT Software Solutions. Your order has been confirmed.',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-5xl py-12">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
        <p className="text-muted-foreground max-w-2xl">
          Thank you for your purchase. Your order has been confirmed and is
          being processed.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a confirmation email with details about your purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you're a new customer, the email contains your login
              credentials. Use these to access the purchased apps.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your spam folder if you don't see the email in your
              inbox.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Getting started with your new software
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                1
              </div>
              <p>Check your email for app access links</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                2
              </div>
              <p>Log in with the credentials from your email</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                3
              </div>
              <p>Change your temporary password for security</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
