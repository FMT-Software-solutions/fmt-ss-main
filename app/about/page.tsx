import { Metadata } from 'next';
import AboutHero from './AboutHero';
import AboutCards from './AboutCards';
import AboutStory from './AboutStory';
import AboutAchievements from './AboutAchievements';
import TeamSection from './TeamSection';
import FocusAreas from './FocusAreas';

export const metadata: Metadata = {
  title: 'About Us - FMT Software Solutions | Ghana\'s Leading Software Development Company',
  description: 'Learn about FMT Software Solutions, Ghana\'s premier software development company. Discover our mission, values, story, and achievements in building innovative technology solutions for Africa and beyond.',
  keywords: 'about FMT Software Solutions, Ghana software company, African tech company, software development team, company history, mission values, technology solutions Ghana',
  openGraph: {
    title: 'About Us - FMT Software Solutions | Ghana\'s Leading Software Development Company',
    description: 'Learn about FMT Software Solutions, Ghana\'s premier software development company. Discover our mission, values, story, and achievements in building innovative technology solutions for Africa and beyond.',
    url: 'https://fmtsoftware.com/about',
    images: [
      {
        url: 'https://fmtsoftware.com/images/fmt-bg.png',
        width: 1200,
        height: 630,
        alt: 'About FMT Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - FMT Software Solutions | Ghana\'s Leading Software Development Company',
    description: 'Learn about FMT Software Solutions, Ghana\'s premier software development company. Discover our mission, values, story, and achievements in building innovative technology solutions for Africa and beyond.',
    images: ['https://fmtsoftware.com/images/fmt-bg.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <AboutHero />
        <AboutCards />
        <AboutStory />
        <TeamSection />
        <AboutAchievements />
        <FocusAreas />
      </div>
    </div>
  );
}
