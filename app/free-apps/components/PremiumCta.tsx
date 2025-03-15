'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PremiumCta() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Need More Features?</h2>
      <p className="text-muted-foreground mb-6">
        Check out our premium solutions for advanced features and professional
        support.
      </p>
      <Button size="lg" variant="outline" asChild>
        <Link href="/store">Explore Premium Apps</Link>
      </Button>
    </div>
  );
}
