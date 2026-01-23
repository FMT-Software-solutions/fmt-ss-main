import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { allPremiumAppsQuery } from '@/sanity/lib/queries';

interface ManualAppSummary {
  id: string;
  title: string;
  price: number;
}

export async function GET() {
  try {
    const apps = await sanityClient.fetch<Array<{ _id: string; title: string; price?: number }>>(
      allPremiumAppsQuery
    );

    const summaries: ManualAppSummary[] = apps.map((app) => ({
      id: app._id,
      title: app.title,
      price: app.price ?? 0,
    }));

    return NextResponse.json({ apps: summaries });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load apps' },
      { status: 500 }
    );
  }
}
