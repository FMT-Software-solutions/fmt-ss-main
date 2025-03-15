import { Metadata } from 'next';
import AboutHero from './AboutHero';
import AboutCards from './AboutCards';
import AboutStory from './AboutStory';
import AboutAchievements from './AboutAchievements';

export const metadata: Metadata = {
  title: 'About FMT Software Solutions',
  description:
    'Learn about our mission, team, and values at FMT Software Solutions',
};

// This is now a Server Component in React 19
export default function About() {
  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <AboutHero />
        <AboutCards />
        <AboutStory />
        <AboutAchievements />
      </div>
    </div>
  );
}
