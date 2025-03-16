'use client';

import { useState, useEffect } from 'react';
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

export default function ClientProjectsContainer({
  projects,
}: {
  projects: Project[];
}) {
  console.log(projects);
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
