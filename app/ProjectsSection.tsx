'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IProject } from '@/consts/projects';

interface ProjectCardProps {
  project: IProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
    >
      <Link href={project.link} target="_blank" rel="noopener noreferrer">
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default function ProjectsSection({
  projects,
}: {
  projects: IProject[];
}) {
  return (
    <section className="w-full bg-gray-50 py-16 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Our Projects
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Explore some of our recent web development projects
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
