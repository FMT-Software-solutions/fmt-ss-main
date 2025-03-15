import { Metadata } from 'next';
import FreeAppsHero from './components/FreeAppsHero';
import FreeAppsList from './components/FreeAppsList';
import PremiumCta from './components/PremiumCta';

export const metadata: Metadata = {
  title: 'Free Applications - FMT Software Solutions',
  description:
    'Download free productivity tools and utilities for your business',
};

// This is now a Server Component in React 19
export default function FreeApps() {
  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <FreeAppsHero />
        <FreeAppsList />
        <PremiumCta />
      </div>
    </div>
  );
}
