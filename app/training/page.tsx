import { Metadata } from 'next';
import TrainingHero from './components/TrainingHero';
import TrainingList from './components/TrainingList';
import { getAllTrainings, getAllTrainingTypes } from '@/lib/sanity';

// Disable caching for immediate updates
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Professional Training Programs & Workshops',
  description:
    'Enhance your skills with our comprehensive professional training programs and workshops. Expert-led courses in software development, technology, and business skills designed for professionals in Ghana and beyond.',
  keywords: [
    'professional training programs',
    'software development training',
    'technology workshops',
    'business skills training',
    'professional development',
    'Ghana training programs',
    'tech training courses',
    'software workshops'
  ],
  openGraph: {
    title: 'Professional Training Programs & Workshops | FMT Software Solutions',
    description: 'Enhance your skills with our comprehensive professional training programs. Expert-led courses in software development and technology.',
    url: 'https://fmtsoftware.com/training',
    images: [
      {
        url: '/fmt-logo.png',
        width: 1200,
        height: 630,
        alt: 'Professional Training Programs - FMT Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Training Programs & Workshops | FMT Software Solutions',
    description: 'Enhance your skills with our comprehensive professional training programs and workshops.',
    images: ['/fmt-logo.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com/training',
  },
};

export default async function TrainingPage() {
  // Fetch trainings and training types from Sanity
  const trainings = await getAllTrainings();
  const trainingTypes = await getAllTrainingTypes();

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <TrainingHero />
        <TrainingList trainings={trainings} trainingTypes={trainingTypes} />
      </div>
    </div>
  );
}
