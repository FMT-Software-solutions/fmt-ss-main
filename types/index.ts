export type Route =
  | 'login'
  | 'signup'
  | 'reset-password'
  | 'service-selection'
  | 'dashboard'
  | 'pricing'
  | 'calculator'
  | 'settings'
  | 'users';

export type Role = 'owner' | 'admin' | 'viewer' | 'member';

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full access to all features and can manage all users',
  admin: 'Can manage users and has full access to all features',
  viewer: 'Can view data but cannot make changes',
  member: 'Basic user without login access',
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  viewer: 'Viewer',
  member: 'Member',
};

export const ROLE_COLORS: Record<Role, string> = {
  owner:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800',
  admin:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
  viewer:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
  member:
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
};

export type HSL = [number, number, number];

export type ColorMode = 'light' | 'dark';
