import { IDiscountCode, IDiscountValidationResult, IPremiumApp } from '@/types/premium-app';
import { getCurrentPrice, isPromotionActive } from './utils';

/**
 * Validates if a discount code can be applied to the current cart
 */
export function validateDiscountCode(
  discountCode: IDiscountCode,
  cartItems: IPremiumApp[],
  userEmail?: string,
  userPreviousPurchases?: string[]
): IDiscountValidationResult {
  // Check if discount is active
  if (!discountCode.isActive) {
    return {
      isValid: false,
      errorMessage: 'This discount code is not active',
      applicableItems: [],
      totalDiscount: 0,
    };
  }

  // Check validity period
  const now = new Date();
  const startDate = new Date(discountCode.validityPeriod.startDate);
  const endDate = new Date(discountCode.validityPeriod.endDate);

  if (now < startDate) {
    return {
      isValid: false,
      errorMessage: 'This discount code is not yet valid',
      applicableItems: [],
      totalDiscount: 0,
    };
  }

  if (now > endDate) {
    return {
      isValid: false,
      errorMessage: 'This discount code has expired',
      applicableItems: [],
      totalDiscount: 0,
    };
  }

  // Check first time purchase requirement
  if (discountCode.discountType === 'first_time') {
    if (userPreviousPurchases && userPreviousPurchases.length > 0) {
      return {
        isValid: false,
        errorMessage: 'This discount is only valid for first-time purchases',
        applicableItems: [],
        totalDiscount: 0,
      };
    }
  }

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + getCurrentPrice(item);
  }, 0);

  // Check minimum total requirement
  if (discountCode.discountType === 'minimum_total' && discountCode.minimumAmount) {
    if (cartTotal < discountCode.minimumAmount) {
      return {
        isValid: false,
        errorMessage: `Minimum order total of GHS${discountCode.minimumAmount} required`,
        applicableItems: [],
        totalDiscount: 0,
      };
    }
  }

  // Check bundle requirements
  if (discountCode.discountType === 'bundle' && discountCode.minimumAppsCount) {
    if (cartItems.length < discountCode.minimumAppsCount) {
      return {
        isValid: false,
        errorMessage: `Minimum ${discountCode.minimumAppsCount} apps required for this bundle discount`,
        applicableItems: [],
        totalDiscount: 0,
      };
    }
  }

  // Apply discount based on type
  return applyDiscountToCart(discountCode, cartItems);
}

/**
 * Applies discount to cart items based on discount type
 */
function applyDiscountToCart(
  discountCode: IDiscountCode,
  cartItems: IPremiumApp[]
): IDiscountValidationResult {
  const applicableItems: {
    appId: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }[] = [];

  let totalDiscount = 0;

  switch (discountCode.discountType) {
    case 'all_apps':
      // Apply discount to all apps in cart
      cartItems.forEach((item) => {
        const originalPrice = getCurrentPrice(item);
        const discountAmount = calculateDiscountAmount(discountCode, originalPrice);
        const finalPrice = Math.max(0, originalPrice - discountAmount);

        applicableItems.push({
          appId: item._id,
          originalPrice,
          discountAmount,
          finalPrice,
        });

        totalDiscount += discountAmount;
      });
      break;

    case 'specific_apps':
      // Apply discount only to specified apps
      if (!discountCode.applicableApps || discountCode.applicableApps.length === 0) {
        return {
          isValid: false,
          errorMessage: 'No applicable apps specified for this discount',
          applicableItems: [],
          totalDiscount: 0,
        };
      }

      const applicableAppIds = discountCode.applicableApps.map(app => app._id);
      const matchingItems = cartItems.filter(item => applicableAppIds.includes(item._id));

      if (matchingItems.length === 0) {
        return {
          isValid: false,
          errorMessage: 'None of the items in your cart are eligible for this discount',
          applicableItems: [],
          totalDiscount: 0,
        };
      }

      matchingItems.forEach((item) => {
        const originalPrice = getCurrentPrice(item);
        const discountAmount = calculateDiscountAmount(discountCode, originalPrice);
        const finalPrice = Math.max(0, originalPrice - discountAmount);

        applicableItems.push({
          appId: item._id,
          originalPrice,
          discountAmount,
          finalPrice,
        });

        totalDiscount += discountAmount;
      });
      break;

    case 'minimum_total':
    case 'first_time':
      // Apply discount to all apps (already validated requirements above)
      cartItems.forEach((item) => {
        const originalPrice = getCurrentPrice(item);
        const discountAmount = calculateDiscountAmount(discountCode, originalPrice);
        const finalPrice = Math.max(0, originalPrice - discountAmount);

        applicableItems.push({
          appId: item._id,
          originalPrice,
          discountAmount,
          finalPrice,
        });

        totalDiscount += discountAmount;
      });
      break;

    case 'bundle':
      // Apply discount to specified apps if minimum count is met
      if (!discountCode.applicableApps || discountCode.applicableApps.length === 0) {
        // If no specific apps, apply to all
        cartItems.forEach((item) => {
          const originalPrice = getCurrentPrice(item);
          const discountAmount = calculateDiscountAmount(discountCode, originalPrice);
          const finalPrice = Math.max(0, originalPrice - discountAmount);

          applicableItems.push({
            appId: item._id,
            originalPrice,
            discountAmount,
            finalPrice,
          });

          totalDiscount += discountAmount;
        });
      } else {
        // Apply to specified apps only
        const applicableAppIds = discountCode.applicableApps.map(app => app._id);
        const matchingItems = cartItems.filter(item => applicableAppIds.includes(item._id));

        matchingItems.forEach((item) => {
          const originalPrice = getCurrentPrice(item);
          const discountAmount = calculateDiscountAmount(discountCode, originalPrice);
          const finalPrice = Math.max(0, originalPrice - discountAmount);

          applicableItems.push({
            appId: item._id,
            originalPrice,
            discountAmount,
            finalPrice,
          });

          totalDiscount += discountAmount;
        });
      }
      break;

    default:
      return {
        isValid: false,
        errorMessage: 'Invalid discount type',
        applicableItems: [],
        totalDiscount: 0,
      };
  }

  // Apply maximum discount cap if specified
  if (discountCode.maxDiscount && totalDiscount > discountCode.maxDiscount) {
    const reductionRatio = discountCode.maxDiscount / totalDiscount;
    totalDiscount = discountCode.maxDiscount;

    // Proportionally reduce discount amounts
    applicableItems.forEach((item) => {
      item.discountAmount = item.discountAmount * reductionRatio;
      item.finalPrice = item.originalPrice - item.discountAmount;
    });
  }

  return {
    isValid: true,
    applicableItems,
    totalDiscount,
  };
}

/**
 * Calculates discount amount for a single item
 */
function calculateDiscountAmount(discountCode: IDiscountCode, originalPrice: number): number {
  if (discountCode.valueType === 'percentage') {
    return (originalPrice * discountCode.value) / 100;
  } else {
    // Fixed amount - but don't exceed the original price
    return Math.min(discountCode.value, originalPrice);
  }
}

/**
 * Checks if discount can be stacked with promotions
 */
export function canStackWithPromotions(
  discountCode: IDiscountCode,
  cartItems: IPremiumApp[]
): boolean {
  if (!discountCode.stackable) {
    // Check if any items have active promotions
    return !cartItems.some(item => 
      item.promotion && isPromotionActive(item)
    );
  }
  return true;
}

/**
 * Gets the best applicable discount from multiple discount codes
 */
export function getBestDiscount(
  discountCodes: IDiscountCode[],
  cartItems: IPremiumApp[],
  userEmail?: string,
  userPreviousPurchases?: string[]
): IDiscountValidationResult | null {
  const validDiscounts = discountCodes
    .filter(code => canStackWithPromotions(code, cartItems))
    .map(code => ({
      code,
      result: validateDiscountCode(code, cartItems, userEmail, userPreviousPurchases)
    }))
    .filter(({ result }) => result.isValid)
    .sort((a, b) => {
      // Sort by total discount (descending) then by priority (ascending)
      if (b.result.totalDiscount !== a.result.totalDiscount) {
        return b.result.totalDiscount - a.result.totalDiscount;
      }
      return a.code.priority - b.code.priority;
    });

  return validDiscounts.length > 0 ? validDiscounts[0].result : null;
}

/**
 * Formats discount amount for display
 */
export function formatDiscountDisplay(discountCode: IDiscountCode): string {
  if (discountCode.valueType === 'percentage') {
    return `${discountCode.value}% OFF`;
  } else {
    return `GHS${discountCode.value} OFF`;
  }
}

/**
 * Calculates final cart total after discount
 */
export function calculateFinalTotal(
  cartItems: IPremiumApp[],
  validationResult: IDiscountValidationResult
): number {
  if (!validationResult.isValid) {
    return cartItems.reduce((total, item) => total + getCurrentPrice(item), 0);
  }

  const discountedItems = new Map(validationResult.applicableItems.map(item => [item.appId, item.finalPrice]));
  
  return cartItems.reduce((total, item) => {
    const finalPrice = discountedItems.get(item._id) ?? getCurrentPrice(item);
    return total + finalPrice;
  }, 0);
}