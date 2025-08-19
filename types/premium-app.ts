export interface IDiscountCode {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  discountType: 'all_apps' | 'specific_apps' | 'minimum_total' | 'first_time' | 'bundle';
  valueType: 'percentage' | 'fixed';
  value: number;
  applicableApps?: {
    _id: string;
    title: string;
    slug: { current: string };
  }[];
  minimumAmount?: number;
  minimumAppsCount?: number;
  maxDiscount?: number;
  usageLimit?: {
    enabled: boolean;
    totalUses?: number;
    perUserLimit?: number;
  };
  validityPeriod: {
    startDate: string;
    endDate: string;
  };
  stackable: boolean;
  priority: number;
  createdAt: string;
}

export interface IDiscountValidationResult {
  isValid: boolean;
  errorMessage?: string;
  applicableItems: {
    appId: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }[];
  totalDiscount: number;
}

export interface IDiscountApplication {
  discountCode: IDiscountCode;
  validationResult: IDiscountValidationResult;
}

export interface IPromotion {
  hasPromotion: boolean;
  discountPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface IVideo {
  type?: 'youtube' | 'custom';
  url?: string;
}

export interface IPremiumApp {
  _id: string;
  id?: string; // Used in local data
  title: string;
  slug: { type?: string; current: string };
  isPublished: boolean;
  mainImage: any;
  screenshots: any[];
  video?: IVideo;
  videoUrl?: string; // Deprecated - kept for backward compatibility
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
  price: number;
  promotion?: IPromotion;
  publishedAt?: string;
}

// Type for the premium app list view (with fewer fields)
export interface IPremiumAppListItem {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  isPublished: boolean;
  mainImage: any;
  shortDescription: string;
  sectors: string[];
  features: string[];
  tags: string[];
  price: number;
  promotion?: {
    hasPromotion: boolean;
    discountPrice?: number;
    isActive: boolean;
  };
  publishedAt?: string;
}
