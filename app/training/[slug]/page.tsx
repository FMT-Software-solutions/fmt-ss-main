import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import TrainingDetailClient from './components/TrainingDetailClient';
import { unstable_cache } from 'next/cache';

// Cache configuration - revalidates every 60 seconds
export const revalidate = 60;

// Add a dynamic segment config to opt out of static generation
export const dynamic = 'force-dynamic';

// Use unstable_cache with a short TTL to ensure fresh data
const getTrainingWithCache = unstable_cache(
  async (slug: string) => {
    return getTrainingBySlug(slug);
  },
  ['training-detail'],
  { revalidate: 60 } // Revalidate cache every 60 seconds
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingWithCache(slug);

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
  const training = await getTrainingWithCache(slug);

  if (!training) {
    notFound();
  }

  return <TrainingDetailClient training={training} />;
}
