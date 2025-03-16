export interface IPublicProject {
  _id: string;
  title: string;
  slug: { type?: string; current: string };
  mainImage: any;
  screenshots: any;
  description: any[];
  shortDescription: string;
  sectors: string[];
  status: string;
  tags: string[];
  features: string[];
  platforms: {
    name: string;
    slug: { type?: string; current: string };
    icon: string;
  }[];
  projectUrl?: string | null;
  publishedAt: string;
}
