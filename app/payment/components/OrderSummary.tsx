'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Workshop } from '../../../workshops';

interface OrderSummaryProps {
  workshop: Workshop;
}

export default function OrderSummary({ workshop }: OrderSummaryProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{workshop.title}</span>
            <span className="font-semibold">${workshop.price}</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${workshop.price}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
