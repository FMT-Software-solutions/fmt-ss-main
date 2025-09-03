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
  title: 'Home',
  description:
    'FMT Software Solutions delivers premium software solutions for modern businesses in Ghana and beyond. Specializing in web applications, desktop software, mobile apps, and comprehensive training programs.',
  keywords: [
    'software development Ghana',
    'web applications',
    'desktop applications',
    'mobile app development',
    'software training',
    'business software solutions',
    'custom software development',
    'Ghana tech company',
    'software consulting',
    'enterprise software'
  ],
  openGraph: {
    title: 'FMT Software Solutions - Premium Software & Training',
    description: 'Leading software development company in Ghana. We build premium web, desktop, and mobile applications for modern businesses.',
    url: 'https://fmtsoftware.com',
    images: [
      {
        url: 'https://fmtsoftware.com/images/fmt-bg.png',
        width: 1200,
        height: 630,
        alt: 'FMT Software Solutions - Premium Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FMT Software Solutions - Premium Software & Training',
    description: 'Leading software development company in Ghana. We build premium web, desktop, and mobile applications.',
    images: ['https://fmtsoftware.com/images/fmt-bg.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com',
  },
};

// This is now a Server Component in React 19
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FMT Software Solutions",
    "description": "Premium software solutions for modern businesses. Web, desktop, and mobile applications.",
    "url": "https://fmtsoftware.com",
    "logo": "https://fmtsoftware.com/fmt-logo.png",
    "foundingDate": "2020",
    "foundingLocation": {
      "@type": "Place",
      "name": "Ghana"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Ghana"
      },
      {
        "@type": "Place",
        "name": "Global"
      }
    ],
    "serviceType": [
      "Software Development",
      "Web Application Development",
      "Desktop Application Development",
      "Mobile Application Development",
      "Software Training",
      "Software Consulting"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://fmtsoftware.com/contact"
    },
    "sameAs": [
      "https://twitter.com/fmt_software",
      "https://linkedin.com/company/fmtsoftware"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
    </>
  );
}
