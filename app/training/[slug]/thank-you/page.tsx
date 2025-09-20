import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTrainingBySlug } from '@/lib/sanity';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeftIcon, UserCheckIcon } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);

  if (!training) {
    return {
      title: 'Registration Complete',
      description: 'Thank you for registering for our training program.',
    };
  }

  return {
    title: `Registration Complete - ${training.title} | FMT Software Solutions`,
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
    <div className="container max-w-4xl py-12">
      <div className="max-w-lg mx-auto text-center">
        <UserCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Registration Complete!</h1>
        <p className="text-xl mb-2">
          Thank you for registering for "{training.title}"
        </p>
        <div className="bg-muted p-6 rounded-lg my-8 text-left">
          <h2 className="font-semibold text-lg mb-2">What happens next?</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CalendarIcon className="h-5 w-5 mr-2 mt-0.5 text-primary" />
              <span>
                You will receive a confirmation email with all the training
                details after confirmation
              </span>
            </li>
            <li className="flex items-start">
              <CalendarIcon className="h-5 w-5 mr-2 mt-0.5 text-primary" />
              <span>
                We will send you a reminder a few days before the training date
              </span>
            </li>
            {training.location?.toLowerCase() === 'online' && (
              <li className="flex items-start">
                <CalendarIcon className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>
                  You will receive the online meeting link or be invited to the
                  scheduled meetings
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href={`/training/${training.slug.current}`}>
            <Button variant="outline" className="flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Training
            </Button>
          </Link>
          <Link href="/training">
            <Button variant="outline">View All Trainings</Button>
          </Link>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
