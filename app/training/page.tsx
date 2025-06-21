import { Metadata } from 'next';
import TrainingHero from './components/TrainingHero';
import TrainingList from './components/TrainingList';
import { getAllTrainings, getAllTrainingTypes } from '@/lib/sanity';

// Disable caching for immediate updates
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Training Programs | FMT Software Solutions',
  description:
    'Enhance your skills with our professional training programs and workshops',
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
