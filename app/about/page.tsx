import { Metadata } from 'next';
import AboutHero from './AboutHero';
import AboutCards from './AboutCards';
import AboutStory from './AboutStory';
import AboutAchievements from './AboutAchievements';
import { featureFlags } from '@/consts/feature-flags';

export const metadata: Metadata = {
  title: 'About FMT Software Solutions',
  description:
    'Learn about our mission, vision, and how we build software solutions to address challenges in Ghana and provide premium services to businesses and individuals.',
};

// This is now a Server Component in React 19
export default function About() {
  return (
    <main className="min-h-screen py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <AboutHero />
        <AboutCards />
        <AboutStory />
        {featureFlags.achievements && <AboutAchievements />}

        <div className="text-center mt-12 mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Focus Areas</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We work on innovative apps and projects to address issues and
            challenges in Ghana as a country. Our goal is to build solutions
            that drive Ghana's development across all sectors.
          </p>
        </div>
      </div>
    </main>
  );
}
