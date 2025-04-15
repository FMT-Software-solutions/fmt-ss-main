'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderSummary() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Title</span>
            <span className="font-semibold">GHS200</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                <sup>GHS</sup> 200
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
