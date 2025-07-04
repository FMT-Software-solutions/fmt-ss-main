import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import TrainingDetailClient from './components/TrainingDetailClient';

// Disable all caching for immediate updates
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);

  if (!training) {
    return {
      title: 'Training Not Found',
      description: 'The requested training program could not be found.',
    };
  }

  return {
    title: `${training.title} | FMT Software Solutions`,
    description: training.shortDescription,
  };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);

  if (!training) {
    notFound();
  }

  return <TrainingDetailClient training={training} />;
}
