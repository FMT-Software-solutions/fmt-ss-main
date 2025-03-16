import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug) {
    return new Response('No slug in the query', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  const draftModeState = await draftMode();
  draftModeState.enable();

  // Redirect to the path from the fetched post
  redirect(`/projects/${slug}`);
}
