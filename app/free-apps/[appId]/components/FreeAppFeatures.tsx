'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { FreeApp } from '../../data';

interface FreeAppFeaturesProps {
  features: FreeApp['features'];
}

export default function FreeAppFeatures({ features }: FreeAppFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
