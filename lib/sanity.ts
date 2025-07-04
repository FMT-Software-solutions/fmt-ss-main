import { client } from '@/sanity/lib/client';
import {
  allEventsQuery,
  allFreeAppsQuery,
  allPremiumAppsQuery,
  allTrainingsQuery,
  allTrainingTypesQuery,
  eventBySlugQuery,
  featuredEventsQuery,
  featuredTrainingsQuery,
  freeAppBySlugQuery,
  premiumAppBySlugQuery,
  trainingBySlugQuery,
} from '@/sanity/lib/queries';
import { IFreeApp, IFreeAppListItem } from '@/types/free-app';
import { IPremiumApp, IPremiumAppListItem } from '@/types/premium-app';
import { ITraining, ITrainingListItem } from '@/types/training';
import { IEvent, IEventListItem } from '@/types/event';

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

// Function to fetch all training programs
export async function getAllTrainings(): Promise<ITrainingListItem[]> {
  try {
    const trainings = await client.fetch(
      allTrainingsQuery,
      {},
      {
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    );
    return trainings || [];
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return [];
  }
}

// Function to fetch featured training programs
export async function getFeaturedTrainings(): Promise<ITrainingListItem[]> {
  try {
    const trainings = await client.fetch(featuredTrainingsQuery);
    return trainings || [];
  } catch (error) {
    console.error('Error fetching featured trainings:', error);
    return [];
  }
}

// Function to fetch a training program by slug
export async function getTrainingBySlug(
  slug: string
): Promise<ITraining | null> {
  try {
    // Use client with cache disabled for immediate updates
    const training = await client.fetch(
      trainingBySlugQuery,
      { slug },
      {
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    );

    if (!training) return null;

    return training;
  } catch (error) {
    console.error(`Error fetching training with slug ${slug}:`, error);
    return null;
  }
}

// Function to fetch all training types
export async function getAllTrainingTypes() {
  try {
    const types = await client.fetch(allTrainingTypesQuery);
    return types || [];
  } catch (error) {
    console.error('Error fetching training types:', error);
    return [];
  }
}

// Events
export async function getEvents(): Promise<IEventListItem[]> {
  try {
    const events = await client.fetch(allEventsQuery);
    return events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getFeaturedEvents(): Promise<IEventListItem[]> {
  try {
    const events = await client.fetch(featuredEventsQuery);
    return events || [];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<IEvent | null> {
  try {
    const event = await client.fetch(eventBySlugQuery, { slug });

    if (!event) return null;

    return event;
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return null;
  }
}
