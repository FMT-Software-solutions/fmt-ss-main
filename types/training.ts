export interface ITraining {
  _id: string;
  id?: string; // Used in local data
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  videoUrl?: string; // YouTube video URL
  description: any[]; // For rich text content from Sanity
  shortDescription: string;
  longDescription?: string; // Used in local data
  duration: string;
  price: number; // 0 for free trainings
  isFree: boolean;
  trainingType?: {
    name: string;
    slug: { type?: string; current: string };
  };
  trainingTypes?: {
    name: string;
    slug: { type?: string; current: string };
  }[];
  registrationLink?: {
    linkType: 'internal' | 'external';
    internalPath?: string;
    externalUrl?: string;
    linkText?: string;
  };
  startDate?: string;
  endDate?: string;
  location?: string;
  joiningLink?: string; // Deprecated - kept for backwards compatibility
  eventLinks?: {
    trainingType: {
      _id: string;
      name: string;
      slug: { type?: string; current: string };
    };
    link: string;
    linkText: string;
  }[];
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
  isPublished?: boolean;
  registrationEndDate?: string;
  closeRegistration?: boolean;
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
  trainingType?: {
    name: string;
    slug: { type?: string; current: string };
  };
  trainingTypes?: {
    name: string;
    slug: { type?: string; current: string };
  }[];
  startDate?: string;
  location?: string;
  tags: string[];
  featured: boolean;
  publishedAt?: string;
  isPublished?: boolean;
  registrationEndDate?: string;
  closeRegistration?: boolean;
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

// Type for custom training registration
export interface ICustomTrainingRegistration {
  id: string;
  training_id: string;
  training_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_method?: 'paystack' | 'momo' | null;
  details: {
    session?: string;
    about?: string;
    experience: string[];
    expectations?: string;
    [key: string]: any; // Allow for additional custom fields
  };
  created_at: string;
  updated_at: string;
}

// Type for custom registration form data
export interface ICustomRegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  about: string;
  experience: string[];
  expectations: string;
  paymentMethod?: 'paystack' | 'momo';
}
