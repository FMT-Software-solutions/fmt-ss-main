'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Workshop } from '../../../workshops';

interface PaymentFormProps {
  workshop: Workshop;
  registrationData: any;
}

export default function PaymentForm({
  workshop,
  registrationData,
}: PaymentFormProps) {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement actual payment processing
    console.log('Processing payment:', { paymentData, registrationData });

    // Simulate payment processing
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Processing payment...',
      success: 'Registration completed successfully!',
      error: 'Payment processing failed.',
    });

    // Redirect to confirmation page after successful payment
    setTimeout(() => {
      router.push(`/training/${workshop.id}/confirmation`);
    }, 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              value={paymentData.name}
              onChange={(e) =>
                setPaymentData({ ...paymentData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={paymentData.cardNumber}
              onChange={(e) =>
                setPaymentData({ ...paymentData, cardNumber: e.target.value })
              }
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={paymentData.expiryDate}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, expiryDate: e.target.value })
                }
                required
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                value={paymentData.cvv}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cvv: e.target.value })
                }
                required
                maxLength={4}
                placeholder="123"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Pay ${workshop.price}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
