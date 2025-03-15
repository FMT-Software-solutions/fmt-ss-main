import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { workshops } from '../workshops';
import WorkshopRegistration from './components/WorkshopRegistration';

type Props = {
  params: Promise<{ workshopId: string }> & { workshopId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Resolve the promise
  const resolvedParams = await params;
  const workshopId = resolvedParams.workshopId;

  const workshop = workshops.find((w) => w.id === workshopId);

  if (!workshop) {
    return {
      title: 'Workshop Not Found',
    };
  }

  return {
    title: `${workshop.title} | FMT Software Solutions`,
    description: workshop.description,
  };
}

export function generateStaticParams() {
  return workshops.map((workshop) => ({
    workshopId: workshop.id,
  }));
}

export default async function WorkshopPage({ params }: Props) {
  // Resolve the promise
  const resolvedParams = await params;
  const workshopId = resolvedParams.workshopId;

  const workshop = workshops.find((w) => w.id === workshopId);

  if (!workshop) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <WorkshopRegistration workshop={workshop} />
    </main>
  );
}
