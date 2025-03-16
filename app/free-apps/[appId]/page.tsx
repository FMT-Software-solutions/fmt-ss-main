import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { freeApps } from '../data';
import FreeAppPageClient from './components/FreeAppPageClient';
import { IFreeApp } from '@/types/free-app';

export async function generateStaticParams() {
  return freeApps.map((app) => ({
    appId: app.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { appId: string };
}): Promise<Metadata> {
  const app = freeApps.find((a) => a.id === params.appId);

  if (!app) {
    return {
      title: 'App Not Found',
      description: 'The requested app could not be found.',
    };
  }

  return {
    title: app.title,
    description: app.shortDescription,
  };
}

export default async function FreeAppPage({
  params,
}: {
  params: { appId: string };
}) {
  const app = freeApps.find((a) => a.id === params.appId);

  if (!app) {
    notFound();
  }

  // Transform the app to match the expected format for the client component
  const transformedApp: IFreeApp = {
    ...app,
  };

  return <FreeAppPageClient app={transformedApp} />;
}
