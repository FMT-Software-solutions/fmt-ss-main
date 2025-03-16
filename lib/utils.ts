import { urlForImage } from '@/sanity/lib/image';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the URL for a Sanity image
 */
export function getSanityImageUrl(image: any) {
  return urlForImage(image)?.url() || '';
}
