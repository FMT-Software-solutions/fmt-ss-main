import { Metadata } from 'next';
import HeroSection from './HeroSection';
// import FeaturedApps from './FeaturedApps';
import FeaturesSection from './FeaturesSection';
import NewsletterSection from './NewsletterSection';
// import ProjectsSection from './ProjectsSection';
// import { projects } from '@/consts/projects';
import { StatsSection } from '@/components/landing/StatsSection';
import { WebAppsSection } from '@/components/landing/WebAppsSection';
import { DesktopAppsSection } from '@/components/landing/DesktopAppsSection';
import { MobileAppsSection } from '@/components/landing/MobileAppsSection';
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel';
import { CTASection } from '@/components/landing/CTASection';

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
      <StatsSection />
      {/* <FeaturedApps /> */}
      {/* <ProjectsSection projects={projects} /> */}
      <WebAppsSection />
      <DesktopAppsSection />
      <MobileAppsSection />
      {/* <FeaturesSection /> */}
      <TestimonialsCarousel />
      <CTASection />
      <NewsletterSection />
    </main>
  );
}
