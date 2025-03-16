'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { IPublicProject } from '@/types/public-project';
import { statusColors } from '@/consts';
import { cn } from '@/lib/utils';

// Featured projects query
const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    publishedAt
  }
`;

export default function FeaturedApps() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          // If Sanity is not configured, use fallback projects
          setIsLoading(false);
          return;
        }

        const data = await client.fetch(featuredProjectsQuery);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        setError(
          'Failed to load projects. Sanity might not be properly configured.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Fallback projects if no featured projects are found
  const fallbackProjects = [
    {
      _id: 'place-finder',
      title: 'Place Finder',
      shortDescription:
        'Locate nearby services like restaurants, banks, and shops based on your current location',
      status: 'upcoming',
      sectors: ['Location'],
      slug: { current: 'place-finder' },
      mainImage: null,
      features: [
        'Find nearby services based on your location',
        'Filter results by category',
        'Get directions to your destination',
        'Save favorite places',
        'Read reviews from other users',
      ],
      platforms: [
        { name: 'Web', slug: { current: 'web' }, icon: 'globe' },
        { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
      ],
    },
    {
      _id: 'rentease',
      title: 'RentEase',
      shortDescription:
        'Connect directly with landlords through verified listings without intermediaries',
      status: 'ongoing',
      sectors: ['Housing'],
      slug: { current: 'rentease' },
      mainImage: null,
      features: [
        'Direct landlord-tenant communication',
        'Verified property listings',
        'In-app document signing',
        'Rental payment processing',
        'Maintenance request tracking',
      ],
      platforms: [{ name: 'Web', slug: { current: 'web' }, icon: 'globe' }],
    },
    {
      _id: 'safenet',
      title: 'SafeNet',
      shortDescription:
        'Report crimes, access emergency services, and receive safety alerts',
      status: 'upcoming',
      sectors: ['Safety'],
      slug: { current: 'safenet' },
      mainImage: null,
      features: [
        'One-touch emergency services access',
        'Crime reporting with photo/video evidence',
        'Real-time safety alerts',
        'Community safety forums',
        'Location sharing with trusted contacts',
      ],
      platforms: [
        { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
      ],
    },
  ];

  // Use fallback projects if no featured projects are found
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Public Projects
        </h2>
        {error && (
          <div className="text-center py-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <Card
                key={index}
                className="h-[350px] flex flex-col animate-pulse"
              >
                <CardHeader className="pb-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="aspect-video bg-muted rounded mb-4"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: IPublicProject;
  index: number;
}) {
  const { title, slug, mainImage, shortDescription, sectors, status } = project;

  // Fallback image URLs for projects without images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle>{title}</CardTitle>
            <Badge
              className={cn(
                'bg-primary',
                statusColors[status] || 'bg-gray-500'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <CardDescription>{shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            {mainImage ? (
              <Image
                src={
                  urlForImage(mainImage)?.url() ||
                  fallbackImages[index % fallbackImages.length]
                }
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={fallbackImages[index % fallbackImages.length]}
                alt={title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex justify-between items-center">
            {sectors && (
              <div className="flex items-center gap-1">
                {sectors.slice(0, 2).map((sector, i) => (
                  <Badge key={sector + i} variant="outline">
                    {sector}
                  </Badge>
                ))}

                {sectors?.length > 2 && (
                  <Badge variant="secondary">+{sectors.length - 2}</Badge>
                )}
              </div>
            )}
            <Button variant="secondary" asChild>
              <Link href={`/projects/${slug.current}`}>Learn More</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
