import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import RegistrationForm from './components/RegistrationForm';
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
  ['training-registration'],
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
    title: `Register for ${training.title} | FMT Software Solutions`,
    description: `Register for our ${training.title} training program. ${
      training.isFree ? 'This training is free!' : ''
    }`,
  };
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = await getTrainingWithCache(slug);

  if (!training) {
    notFound();
  }

  // Check if registration is full
  const hasMaxParticipants = !!training.maxParticipants;
  const registeredParticipants = training.registeredParticipants || 0;
  const maxParticipants = training.maxParticipants || 0;
  const isFull =
    hasMaxParticipants && registeredParticipants >= maxParticipants;

  // Redirect to the training page if registration is full
  if (isFull) {
    redirect(`/training/${training.slug.current}?registration=full`);
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-2">Register for {training.title}</h1>
      <p className="text-muted-foreground mb-8">
        Complete the form below to register for this training program.
      </p>

      <RegistrationForm training={training} />
    </div>
  );
}
