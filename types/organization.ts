import { Role } from '.';
import { ColorPalette } from './colors';

export type LogoOrientation = 'square' | 'portrait' | 'landscape';
export type LogoBackgroundSize = 'cover' | 'contain' | 'fill';

export interface OrganizationLogo {
  url?: string;
  orientation?: LogoOrientation;
  backgroundSize?: LogoBackgroundSize;
}

export interface BillingAddress {
  id: string;
  organization_id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  logoSettings?: OrganizationLogo;
  currency: string;
  notificationSettings?: {
    roleChanges: boolean;
    securityAlerts: boolean;
    appUpdates: boolean;
  };
  branding?: {
    palette?: ColorPalette;
  };
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  industry?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationAdmin {
  organization_id: string;
  user_id: string;
  role: Role;
  created_at: Date | string;
  status: 'active' | 'inactive' | 'invited';
  invitedBy?: string;
  invitedAt?: Date | string;
  joinedAt?: string;
  lastActiveAt?: Date | string;
  updated_at: Date | string;
  position?: string;
  department?: string;
}

export interface OrganizationMember {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  organization_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  addedBy?: string;
  position?: string;
  department?: string;
}
