export interface IEvent {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  videoUrl?: string; // YouTube video URL
  description: any[]; // For rich text content from Sanity
  shortDescription: string;
  startDate: string;
  endDate?: string;
  location: string;
  joiningLink?: string; // For online: joining link, for in-person: directions
  organizer: string;
  registrationLink?: string;
  tags: string[];
  featured: boolean;
  publishedAt?: string;
}

// Type for the event list view (with fewer fields)
export interface IEventListItem {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  shortDescription: string;
  startDate: string;
  location: string;
  tags: string[];
  featured: boolean;
  publishedAt?: string;
}
