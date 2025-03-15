'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '../products';

interface ProductRequirementsProps {
  requirements: Product['requirements'];
}

export default function ProductRequirements({
  requirements,
}: ProductRequirementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Operating System</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {requirements.os.map((os, index) => (
                <li key={index}>{os}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Hardware</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Processor: {requirements.processor}</li>
              <li>Memory: {requirements.memory}</li>
              <li>Storage: {requirements.storage}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
