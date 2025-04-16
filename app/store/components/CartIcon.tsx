'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/cart';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '../types/cart';

export function CartIcon() {
  const { items } = useCartStore();
  const itemCount = items.length;

  if (itemCount === 0) {
    return null;
  }

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/store/cart">
        <ShoppingCart className="h-5 w-5" />
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
}
