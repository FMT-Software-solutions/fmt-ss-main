import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import RegistrationForm from './components/RegistrationForm';

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
  const training = await getTrainingBySlug(slug);

  if (!training) {
    notFound();
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
