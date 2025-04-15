import { Role } from '.';
import { Organization } from './organization';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isFirstLogin: boolean;
  passwordUpdated: boolean;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLoginAt?: string;
  lastActiveAt?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
    timezone?: string;
    language?: string;
  };
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FullUserDetails extends User {
  role: Role;
  organization: Organization;
}
