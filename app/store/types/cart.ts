import { z } from 'zod';
import { IPremiumApp, IDiscountCode } from '@/types/premium-app';

// Simple cart item with only ID for localStorage (quantity always 1 for software)
export interface CartItemStorage {
  productId: string;
}

// Full cart item with product details for display
export interface CartItem {
  productId: string;
  quantity: number;
  product: IPremiumApp;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Storage cart with only IDs
export interface CartStorage {
  items: CartItemStorage[];
}

// App provisioning details for each purchased app
export const appProvisioningDetailsSchema = z.object({
  useSameEmailAsAdmin: z.boolean().default(false),
  userEmail: z.string().email('Invalid user email address').optional(),
});

export type AppProvisioningDetails = z.infer<typeof appProvisioningDetailsSchema>;

// Legacy organization details schema for billing
export const organizationDetailsSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().min(2, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State/Region is required'),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().optional(),
  }),
});

export type OrganizationDetails = z.infer<typeof organizationDetailsSchema>;

// Checkout form data combining billing and app provisioning
export const checkoutFormSchema = z.object({
  billingDetails: organizationDetailsSchema,
  appProvisioningDetails: z.record(z.string(), appProvisioningDetailsSchema), // keyed by productId
  useSameDetailsForAll: z.boolean().default(false),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Re-export the discount code interface from the main types
export type { IDiscountCode as DiscountCode } from '@/types/premium-app';

// Checkout state interface
export interface CheckoutState {
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  appliedDiscount: IDiscountCode | null;
  hasActivePromotions: boolean;
}

export interface PurchaseRecord {
  id: string;
  organization_id: string;
  productId: string;
  purchaseDate: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  temporaryPassword: string;
  organizationDetails: OrganizationDetails;
}
