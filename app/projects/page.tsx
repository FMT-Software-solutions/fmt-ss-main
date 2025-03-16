import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import ProjectsHeader from './components/ProjectsHeader';
import { allProjectsQuery } from '@/sanity/lib/queries';
import ClientProjectsContainer from './components/ClientProjectsContainer';
import { fallbackProjects } from './fallbackProjects';

export const metadata: Metadata = {
  title: 'Public Projects | FMT Software Solutions',
  description:
    'Explore our innovative public projects addressing real challenges',
};

export default async function ProjectsPage() {
  // Fetch projects or use fallback
  let projects = fallbackProjects;
  let error = null;

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      projects = await client.fetch(allProjectsQuery);
      if (!projects || projects.length === 0) {
        projects = fallbackProjects;
      }
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
    error = 'Failed to load projects.';
    projects = fallbackProjects;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <ProjectsHeader />
        {error && (
          <div className="text-center py-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        <ClientProjectsContainer projects={projects} />
      </div>
    </div>
  );
}
