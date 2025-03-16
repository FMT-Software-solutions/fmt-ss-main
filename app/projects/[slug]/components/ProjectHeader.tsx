'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Globe, Monitor, Smartphone } from 'lucide-react';
import { IPublicProject } from '@/types/public-project';
import { statusColors } from '@/consts';

// Platform icons
const platformIcons: Record<string, React.ReactNode> = {
  globe: <Globe className="h-4 w-4 mr-1" />,
  monitor: <Monitor className="h-4 w-4 mr-1" />,
  smartphone: <Smartphone className="h-4 w-4 mr-1" />,
};

// Fallback image
const fallbackImage =
  'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60';

export default function ProjectHeader({
  project,
}: {
  project: IPublicProject;
}) {
  const { title, mainImage, status, sectors, publishedAt, tags, platforms } =
    project;

  // Get image URL or use fallback
  let imageUrl = fallbackImage;
  if (mainImage) {
    const imageBuilder = urlForImage(mainImage);
    if (imageBuilder) {
      imageUrl = imageBuilder.url();
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={statusColors[status] || 'bg-gray-500'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>

            {sectors &&
              sectors.map((sector, i) => (
                <Badge key={sector + i} variant="outline">
                  {sector}
                </Badge>
              ))}

            {publishedAt && (
              <Badge variant="secondary">
                {format(new Date(publishedAt), 'MMMM yyyy')}
              </Badge>
            )}
          </div>
        </motion.div>

        {platforms && platforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-wrap gap-2 mt-2 md:mt-0"
          >
            {platforms.map((platform: any) => (
              <Badge
                key={platform.slug.current}
                variant="outline"
                className="flex items-center"
              >
                {platformIcons[platform.icon] || null}
                {platform.name}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative aspect-video rounded-lg overflow-hidden mb-8"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {tags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}
