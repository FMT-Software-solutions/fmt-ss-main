import { Metadata } from 'next';
import StoreHero from './components/StoreHero';
import StoreContent from './components/StoreContent';
import { getAllPremiumApps } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Premium Software Store - Business Applications',
  description:
    'Browse and purchase premium software solutions for businesses and professionals. Web applications, desktop software, and mobile apps designed to boost productivity and efficiency.',
  keywords: [
    'premium software store',
    'business software purchase',
    'professional applications',
    'enterprise software',
    'productivity software',
    'business apps store',
    'software marketplace',
    'Ghana software store'
  ],
  openGraph: {
    title: 'Premium Software Store - Business Applications | FMT Software Solutions',
    description: 'Browse and purchase premium software solutions designed for businesses and professionals. Boost your productivity with our enterprise-grade applications.',
    url: 'https://fmtsoftware.com/store',
    images: [
      {
        url: 'https://fmtsoftware.com/images/fmt-bg.png',
        width: 1200,
        height: 630,
        alt: 'Premium Software Store - FMT Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Software Store - Business Applications | FMT Software Solutions',
    description: 'Browse and purchase premium software solutions designed for businesses and professionals.',
    images: ['https://fmtsoftware.com/images/fmt-bg.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com/store',
  },
};

// This is a Server Component in React 19
export default async function Store() {
  // Fetch premium apps from Sanity
  const premiumApps = await getAllPremiumApps();

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <StoreHero />
        <StoreContent premiumApps={premiumApps} />
      </div>
    </div>
  );
}
