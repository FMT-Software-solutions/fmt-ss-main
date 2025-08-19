import { urlForImage } from '@/sanity/lib/image';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { IPremiumApp, IPremiumAppListItem } from '@/types/premium-app';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the URL for a Sanity image
 */
export function getSanityImageUrl(image: any) {
  return urlForImage(image)?.url() || '';
}

export function generatePassword(length = 12): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

/**
 * Checks if a promotion is currently active
 */
export function isPromotionActive(product: IPremiumApp | { promotion?: { hasPromotion: boolean; discountPrice?: number; isActive: boolean; startDate?: string; endDate?: string; } }): boolean {
  if (!product.promotion?.hasPromotion || !product.promotion?.isActive) {
    return false;
  }

  const promotion = product.promotion;
  if (!promotion.startDate || !promotion.endDate) {
    return false; // Both dates are required
  }

  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  
  // Security check: if start date is greater than end date, promotion is invalid
  if (startDate >= endDate) {
    return false;
  }
  
  // Security check: if end date is in the past, promotion is expired
  if (now > endDate) {
    return false;
  }
  
  // Check if promotion has started and hasn't ended
  return now >= startDate && now <= endDate;
}

/**
 * Gets the current price for a product considering active promotions
 */
export function getCurrentPrice(product: IPremiumApp | { price: number; promotion?: { hasPromotion: boolean; discountPrice?: number; isActive: boolean; startDate?: string; endDate?: string; } }): number {
  const hasActivePromotion = isPromotionActive(product as IPremiumApp);
  return hasActivePromotion && product.promotion?.discountPrice 
    ? product.promotion.discountPrice 
    : product.price;
}

/**
 * Gets comprehensive pricing information for a product
 */
export function getProductPricing(product: IPremiumApp | IPremiumAppListItem) {
  const hasActivePromotion = isPromotionActive(product);
  const currentPrice = getCurrentPrice(product);
  const originalPrice = product.price;
  const discountPercentage = hasActivePromotion && product.promotion?.discountPrice
    ? Math.round(((originalPrice - product.promotion.discountPrice) / originalPrice) * 100)
    : 0;

  return {
    hasActivePromotion,
    currentPrice,
    originalPrice,
    discountPercentage,
    savings: hasActivePromotion ? originalPrice - currentPrice : 0
  };
}
