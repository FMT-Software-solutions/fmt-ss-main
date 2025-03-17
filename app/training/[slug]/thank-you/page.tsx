import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

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
    title: `Registration Confirmed | ${training.title} | FMT Software Solutions`,
    description: `Thank you for registering for our ${training.title} training program.`,
  };
}

export default async function ThankYouPage({
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
    <div className="container max-w-4xl py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Registration Confirmed!</h1>

        <p className="text-xl mb-8">
          Thank you for registering for{' '}
          <span className="font-semibold">{training.title}</span>
        </p>

        <div className="max-w-md mx-auto mb-10 text-muted-foreground">
          <p className="mb-4">
            We've sent a confirmation email with all the details to your email
            address.
          </p>
          <p>
            If you have any questions or need to make changes to your
            registration, please contact our support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/training">Browse More Trainings</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
