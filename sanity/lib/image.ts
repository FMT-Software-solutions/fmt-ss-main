import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) {
    return undefined;
  }

  return builder.image(source).auto('format').fit('max');
}
