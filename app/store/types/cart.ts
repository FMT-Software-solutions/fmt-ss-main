import { z } from 'zod';
import { IPremiumApp } from '@/types/premium-app';

export interface CartItem {
  productId: string;
  quantity: number;
  product: IPremiumApp;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

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
