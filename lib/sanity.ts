import { client } from '@/sanity/lib/client';
import {
  allFreeAppsQuery,
  allPremiumAppsQuery,
  freeAppBySlugQuery,
  premiumAppBySlugQuery,
} from '@/sanity/lib/queries';
import { IFreeApp, IFreeAppListItem } from '@/types/free-app';
import { IPremiumApp, IPremiumAppListItem } from '@/types/premium-app';

// Function to fetch all free apps
export async function getAllFreeApps(): Promise<IFreeAppListItem[]> {
  try {
    const apps = await client.fetch(allFreeAppsQuery);
    return apps || [];
  } catch (error) {
    console.error('Error fetching free apps:', error);
    return [];
  }
}

// Function to fetch a free app by slug
export async function getFreeAppBySlug(slug: string): Promise<IFreeApp | null> {
  try {
    const app = await client.fetch(freeAppBySlugQuery, { slug });

    if (!app) return null;

    // Transform the app to match our interface
    return {
      ...app,
      price: 0, // Free apps are always free
      requirements: app.systemRequirements || {
        os: [],
        processor: '',
        memory: '',
        storage: '',
      },
    };
  } catch (error) {
    console.error(`Error fetching free app with slug ${slug}:`, error);
    return null;
  }
}

// Function to fetch all premium apps
export async function getAllPremiumApps(): Promise<IPremiumAppListItem[]> {
  try {
    const apps = await client.fetch(allPremiumAppsQuery);
    return apps || [];
  } catch (error) {
    console.error('Error fetching premium apps:', error);
    return [];
  }
}

// Function to fetch a premium app by slug
export async function getPremiumAppBySlug(
  slug: string
): Promise<IPremiumApp | null> {
  try {
    const app = await client.fetch(premiumAppBySlugQuery, { slug });

    if (!app) return null;

    // Transform the app to match our interface
    return {
      ...app,
      requirements: app.systemRequirements || {
        os: [],
        processor: '',
        memory: '',
        storage: '',
      },
    };
  } catch (error) {
    console.error(`Error fetching premium app with slug ${slug}:`, error);
    return null;
  }
}
