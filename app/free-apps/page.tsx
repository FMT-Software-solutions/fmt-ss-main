import { Metadata } from 'next';
import FreeAppsHero from './components/FreeAppsHero';
import FreeAppsList from './components/FreeAppsList';
import PremiumCta from './components/PremiumCta';
import { getAllFreeApps } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Free Apps - Download Business Tools',
  description:
    'Download free productivity tools, utilities, and business applications from FMT Software Solutions. Boost your productivity with our collection of free software.',
  keywords: [
    'free business apps',
    'free productivity tools',
    'free software download',
    'business utilities',
    'free desktop apps',
    'productivity software',
    'Ghana free software',
    'business tools download'
  ],
  openGraph: {
    title: 'Free Apps - Download Business Tools | FMT Software Solutions',
    description: 'Download free productivity tools and business applications. Boost your productivity with our collection of free software.',
    url: 'https://fmtsoftware.com/free-apps',
    images: [
      {
        url: '/fmt-logo.png',
        width: 1200,
        height: 630,
        alt: 'Free Business Apps from FMT Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Apps - Download Business Tools | FMT Software Solutions',
    description: 'Download free productivity tools and business applications to boost your productivity.',
    images: ['/fmt-logo.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com/free-apps',
  },
};

// This is now a Server Component in React 19
export default async function FreeApps() {
  // Fetch free apps from Sanity
  const freeApps = await getAllFreeApps();

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <FreeAppsHero />
        <FreeAppsList freeApps={freeApps} />
        <PremiumCta />
      </div>
    </div>
  );
}
