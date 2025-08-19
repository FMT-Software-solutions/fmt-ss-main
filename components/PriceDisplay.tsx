'use client';

import { IPremiumApp, IPremiumAppListItem } from '@/types/premium-app';
import {
  getCurrentPrice,
  isPromotionActive,
  getProductPricing,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  product: IPremiumApp | IPremiumAppListItem;
  className?: string;
  showSaleBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  currency?: string;
}

export function PriceDisplay({
  product,
  className,
  showSaleBadge = true,
  size = 'md',
  currency = 'GHS',
}: PriceDisplayProps) {
  const isOnSale = isPromotionActive(product);
  const currentPrice = getCurrentPrice(product);
  const pricing = getProductPricing(product);

  const sizeClasses = {
    sm: {
      current: 'text-lg font-semibold',
      original: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    md: {
      current: 'text-2xl font-bold',
      original: 'text-base',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      current: 'text-3xl font-bold',
      original: 'text-lg',
      badge: 'text-sm px-3 py-1',
    },
  };

  const classes = sizeClasses[size];

  if (!isOnSale) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn('text-foreground', classes.current)}>
          {currency}
          {currentPrice.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('text-green-600', classes.current)}>
        {currency}
        {currentPrice.toFixed(2)}
      </span>
      <span
        className={cn('text-muted-foreground line-through', classes.original)}
      >
        {currency}
        {product.price.toFixed(2)}
      </span>
      {showSaleBadge && (
        <span
          className={cn(
            'bg-red-100 text-red-800 rounded font-medium',
            classes.badge
          )}
        >
          SALE
        </span>
      )}
      {pricing.discountPercentage > 0 && (
        <span
          className={cn(
            'bg-green-100 text-green-800 rounded font-medium',
            classes.badge
          )}
        >
          -{pricing.discountPercentage}%
        </span>
      )}
    </div>
  );
}

// Simplified version for inline use
export function InlinePrice({
  product,
  className,
  currency = 'GHS',
}: {
  product: IPremiumApp | IPremiumAppListItem;
  className?: string;
  currency?: string;
}) {
  const currentPrice = getCurrentPrice(product);
  return (
    <span className={className}>
      {currency}
      {currentPrice.toFixed(2)}
    </span>
  );
}

// Version that shows savings amount
export function PriceWithSavings({
  product,
  className,
  currency = 'GHS',
}: {
  product: IPremiumApp | IPremiumAppListItem;
  className?: string;
  currency?: string;
}) {
  const pricing = getProductPricing(product);
  const isOnSale = isPromotionActive(product);

  if (!isOnSale) {
    return (
      <span className={className}>
        {currency}
        {pricing.currentPrice.toFixed(2)}
      </span>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2">
        <span className="text-green-600 font-semibold">
          {currency}
          {pricing.currentPrice.toFixed(2)}
        </span>
        <span className="text-muted-foreground line-through text-xs">
          <sup>{currency}</sup>
          {pricing.originalPrice.toFixed(2)}
        </span>
      </div>
      <span className="text-green-600 text-sm">
        Save {currency}
        {pricing.savings.toFixed(2)} ({pricing.discountPercentage}%)
      </span>
    </div>
  );
}
