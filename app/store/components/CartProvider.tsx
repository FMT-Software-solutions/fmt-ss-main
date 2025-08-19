'use client';

import { useEffect } from 'react';
import { useCartStore } from '../store/cart';
import { toast } from 'sonner';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { validateAndRefreshPrices, loadCartItems, validateCartItems, items } = useCartStore();

  useEffect(() => {
    // Load cart items from Sanity when the component mounts
    const initializeCart = async () => {
      if (items.length > 0 && items.some(item => !item.product)) {
        await loadCartItems();
        
        // Validate cart items and notify user of any removed items
        const invalidIds = await validateCartItems();
        if (invalidIds.length > 0) {
          toast.warning(
            `${invalidIds.length} item(s) were removed from your cart because they are no longer available.`,
            { duration: 5000 }
          );
        }
      }
    };
    
    initializeCart();

    // Set up an interval to periodically check for price changes and item availability
    const interval = setInterval(async () => {
      await validateAndRefreshPrices();
      const invalidIds = await validateCartItems();
      if (invalidIds.length > 0) {
        toast.warning(
          `${invalidIds.length} item(s) were removed from your cart because they are no longer available.`
        );
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [validateAndRefreshPrices, loadCartItems, validateCartItems, items]);

  // Also validate when the page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        await validateAndRefreshPrices();
        const invalidIds = await validateCartItems();
        if (invalidIds.length > 0) {
          toast.warning(
            `${invalidIds.length} item(s) were removed from your cart because they are no longer available.`
          );
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [validateAndRefreshPrices, validateCartItems]);

  return <>{children}</>;
}