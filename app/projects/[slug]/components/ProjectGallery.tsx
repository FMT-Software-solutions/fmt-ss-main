'use client';

import { motion } from 'framer-motion';
import { urlForImage } from '@/sanity/lib/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageGallery } from '@/components/ImageGallery';

// Fallback image
const fallbackImage =
  'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60';

export default function ProjectGallery({
  screenshots,
}: {
  screenshots: any[];
}) {
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  // Get image URL or use fallback
  const getImageUrl = (screenshot: any) => {
    if (!screenshot) return fallbackImage;

    const imageBuilder = urlForImage(screenshot);
    return imageBuilder ? imageBuilder.url() : fallbackImage;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Project Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={screenshots}
            getImageUrl={getImageUrl}
            fallbackImage={fallbackImage}
            aspectRatio="video"
            objectFit="cover"
            altPrefix="Screenshot"
            showNavigation={screenshots.length > 1}
            showPagination={screenshots.length > 1}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
