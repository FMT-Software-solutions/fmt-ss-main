import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FreeAppPageClient from './components/FreeAppPageClient';
import { getFreeAppBySlug } from '@/lib/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ appId: string }>;
}): Promise<Metadata> {
  const { appId } = await params;
  const app = await getFreeAppBySlug(appId);

  if (!app) {
    return {
      title: 'App Not Found',
      description: 'The requested app could not be found.',
    };
  }

  return {
    title: `${app.title} | FMT Software Solutions`,
    description: app.shortDescription,
  };
}

export default async function FreeAppPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const app = await getFreeAppBySlug(appId);

  if (!app) {
    notFound();
  }

  return <FreeAppPageClient app={app} />;
}
