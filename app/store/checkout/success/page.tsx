import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Successful | FMT Software Solutions',
  description: 'Your payment has been processed successfully',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-lg">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. We have sent you an email with your
            login credentials and further instructions.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/store">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
