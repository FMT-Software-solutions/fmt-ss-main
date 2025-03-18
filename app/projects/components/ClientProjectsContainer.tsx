'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectsGrid from './ProjectsGrid';
import ProjectsFilters from './ProjectsFilters';

interface Project {
  _id: string;
  title: string;
  shortDescription?: string;
  status: string;
  sectors: string[];
  tags?: string[];
  [key: string]: any;
}

// This component accesses useSearchParams and must be wrapped in Suspense
function FilteredProjects({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Get filter values from URL
  const sectorParam = searchParams.get('sector');
  const statusParam = searchParams.get('status');
  const searchParam = searchParams.get('search');

  // Apply filters whenever search params change
  useEffect(() => {
    const filtered = projects.filter((project) => {
      // Filter by sector if provided
      if (sectorParam && sectorParam !== 'all') {
        // Check if any of the project's sectors match the filter
        const hasSector = project.sectors?.some(
          (sector) => sector.toLowerCase() === sectorParam.toLowerCase()
        );
        if (!hasSector) return false;
      }

      // Filter by status if provided
      if (statusParam && statusParam !== 'all') {
        if (project.status !== statusParam) return false;
      }

      // Filter by search term if provided
      if (searchParam) {
        const searchLower = searchParam.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(searchLower);
        const descMatch = project.shortDescription
          ? project.shortDescription.toLowerCase().includes(searchLower)
          : false;
        const tagMatch = project.tags
          ? project.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchLower)
            )
          : false;
        const sectorMatch = project.sectors
          ? project.sectors.some((sector: string) =>
              sector.toLowerCase().includes(searchLower)
            )
          : false;

        if (!(titleMatch || descMatch || tagMatch || sectorMatch)) return false;
      }

      return true;
    });

    setFilteredProjects(filtered);
  }, [projects, sectorParam, statusParam, searchParam]);

  return (
    <>
      <ProjectsFilters />
      <ProjectsGrid projects={filteredProjects} />
    </>
  );
}

// Main container component with Suspense
export default function ClientProjectsContainer({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <Suspense
      fallback={<div className="py-8 text-center">Loading projects...</div>}
    >
      <FilteredProjects projects={projects} />
    </Suspense>
  );
}
