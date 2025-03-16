import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { freeApps } from '../data';
import FreeAppPageClient from './components/FreeAppPageClient';

export function generateStaticParams() {
  return freeApps.map((app) => ({
    appId: app.id,
  }));
}

type Props = {
  params: Promise<{ appId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Properly await the params object
  const { appId } = await params;

  const app = freeApps.find((app) => app.id === appId);

  if (!app) {
    return {
      title: 'App Not Found | FMT Software Solutions',
    };
  }

  return {
    title: `${app.title} - Free App | FMT Software Solutions`,
    description: app.description,
  };
}

export default async function FreeAppPage({ params }: Props) {
  // Properly await the params object
  const { appId } = await params;

  const app = freeApps.find((app) => app.id === appId);

  if (!app) {
    notFound();
  }

  // Transform the app to match the expected format for the client component
  const transformedApp = {
    ...app,
  };

  return <FreeAppPageClient app={transformedApp} />;
}
