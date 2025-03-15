import { Metadata } from 'next';
import HeroSection from './HeroSection';
import FeaturedApps from './FeaturedApps';
import FeaturesSection from './FeaturesSection';
import NewsletterSection from './NewsletterSection';

export const metadata: Metadata = {
  title: 'FMT Software Solutions - Home',
  description:
    'Premium software solutions, free tools, and expert training for modern businesses',
};

// This is now a Server Component in React 19
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedApps />
      <FeaturesSection />
      <NewsletterSection />
    </main>
  );
}
