export interface ITraining {
  _id: string;
  id?: string; // Used in local data
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  description: any[]; // For rich text content from Sanity
  shortDescription: string;
  longDescription?: string; // Used in local data
  duration: string;
  price: number; // 0 for free trainings
  isFree: boolean;
  trainingType: {
    name: string;
    slug: { type?: string; current: string };
  };
  startDate?: string;
  endDate?: string;
  location?: string;
  instructor: {
    name: string;
    bio: string;
    image: any;
  };
  prerequisites?: string[];
  syllabus?: {
    title: string;
    description: string;
  }[];
  maxParticipants?: number;
  registeredParticipants?: number;
  tags: string[];
  featured: boolean;
  publishedAt?: string;
}

// Type for the training list view (with fewer fields)
export interface ITrainingListItem {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  shortDescription: string;
  duration: string;
  price: number;
  isFree: boolean;
  trainingType: {
    name: string;
    slug: { type?: string; current: string };
  };
  startDate?: string;
  location?: string;
  tags: string[];
  featured: boolean;
  publishedAt?: string;
}

// Type for registration data
export interface IRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  specialRequirements?: string;
  agreeToTerms: boolean;
}
