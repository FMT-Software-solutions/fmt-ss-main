import { LucideIcon } from 'lucide-react';

export interface NavigationLink {
  href: string;
  icon: LucideIcon;
  label: string;
  featureFlag?: string;
}
