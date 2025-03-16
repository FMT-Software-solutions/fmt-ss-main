export interface IFreeApp {
  _id: string;
  id?: string; // Used in local data
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  screenshots: any[];
  description: any[]; // For rich text content from Sanity
  shortDescription: string;
  longDescription?: string; // Used in local data
  sectors: string[];
  category?: string; // Used in local data
  features: string[];
  requirements: {
    os: string[];
    processor: string;
    memory: string;
    storage: string;
    additionalRequirements?: string[];
  };
  platforms: {
    name: string;
    slug: { type?: string; current: string };
    icon: string;
  }[];
  downloadUrl: string | null;
  webAppUrl: string | null;
  tags: string[];
  price: number; // Always 0 for free apps
  publishedAt?: string;
}

// Type for the free app list view (with fewer fields)
export interface IFreeAppListItem {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  shortDescription: string;
  sectors: string[];
  features: string[];
  tags: string[];
  publishedAt?: string;
}
