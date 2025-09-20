import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { trainingBySlugQuery } from '@/sanity/lib/queries';
import { ITraining } from '@/types/training';
import WebDevBootcampRegistrationForm from './components/WebDevBootcampRegistrationForm';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTraining(slug: string): Promise<ITraining | null> {
  try {
    const training = await client.fetch(trainingBySlugQuery, { slug });
    return training;
  } catch (error) {
    console.error('Error fetching training:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTraining(slug);

  if (!training) {
    return {
      title: 'Training Not Found',
    };
  }

  return {
    title: `Register for ${training.title} | FMT Software Solutions`,
    description: `Register for ${training.title} - ${training.shortDescription}`,
  };
}

export default async function WebDevBootcampRegistrationPage({
  params,
}: Props) {
  const { slug } = await params;
  const training = await getTraining(slug);

  if (!training) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Register for {training.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join our intensive web development bootcamp designed to take you from beginner to job-ready developer.
            Choose your preferred session time!
          </p>
        </div>

        <WebDevBootcampRegistrationForm training={training} />
      </div>
    </div>
  );
}