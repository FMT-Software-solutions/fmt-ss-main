'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { statusColors } from '@/consts';

// Fallback image URLs
const fallbackImages = [
  'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60',
];

export default function ProjectsGrid({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const { title, slug, mainImage, shortDescription, sectors, status, tags } =
    project;

  // Get a fallback image based on index
  const fallbackImage = fallbackImages[index % fallbackImages.length];

  // Get image URL or use fallback
  let imageUrl = fallbackImage;
  if (mainImage) {
    const imageBuilder = urlForImage(mainImage);
    if (imageBuilder) {
      imageUrl = imageBuilder.url();
    }
  }

  // Handle sectors which might be an array of strings, a single string, or undefined
  const sectorsList = Array.isArray(sectors)
    ? sectors
    : typeof sectors === 'string'
      ? [sectors]
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{title}</CardTitle>
            <Badge className={statusColors[status] || 'bg-gray-500'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <CardDescription>{shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {sectorsList.length > 0 ? (
              sectorsList.map((sector, i) => (
                <Badge key={`sector-${i}`} variant="outline">
                  {sector}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No Sector</Badge>
            )}
            {tags?.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {tags?.length > 2 && (
              <Badge variant="secondary">+{tags.length - 2}</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/projects/${slug.current}`}>View Project</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
