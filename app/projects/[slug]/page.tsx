import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import ProjectHeader from './components/ProjectHeader';
import ProjectContent from './components/ProjectContent';
import ProjectGallery from './components/ProjectGallery';
import ProjectActions from './components/ProjectActions';
import ProjectFeatures from './components/ProjectFeatures';
import { groq } from 'next-sanity';
import { fallbackProjects } from './fallbackProjects';
import { IPublicProject } from '@/types/public-project';

// Define the query here as a fallback
const projectBySlugQueryFallback = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    screenshots,
    description,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    features,
    platforms[]->{
      name,
      slug,
      icon
    },
    projectUrl,
    publishedAt
  }
`;

// Fallback projects for when Sanity is not configured

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Properly await the params object
  const { slug } = await params;
  let project: IPublicProject | null = null;

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      project = await client.fetch(projectBySlugQueryFallback, {
        slug,
      });
    }
  } catch (error) {
    console.error('Error fetching project for metadata:', error);
  }

  // Use fallback if no project found
  if (!project) {
    project = fallbackProjects[slug as keyof typeof fallbackProjects];
  }

  if (!project) {
    return {
      title: 'Project Not Found | FMT Software Solutions',
    };
  }

  return {
    title: `${project.title} | FMT Software Solutions`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  // Properly await the params object
  const { slug } = await params;
  let project;
  let error = null;

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      project = await client.fetch(projectBySlugQueryFallback, {
        slug,
      });
    }
  } catch (err) {
    console.error('Error fetching project:', err);
    error =
      'Failed to load project details. Sanity might not be properly configured.';
  }

  // Use fallback if no project found
  if (!project) {
    project = fallbackProjects[slug as keyof typeof fallbackProjects];
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        {error && (
          <div className="text-center py-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        <ProjectHeader project={project} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <ProjectContent project={project} />
            {project.features && project.features.length > 0 && (
              <ProjectFeatures features={project.features} />
            )}
            {project.screenshots && project.screenshots.length > 0 && (
              <ProjectGallery screenshots={project.screenshots} />
            )}
          </div>
          <div className="lg:col-span-1">
            <ProjectActions project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
