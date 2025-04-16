'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getSanityImageUrl } from '@/lib/utils';
import { ImageGallery } from '@/components/ImageGallery';

interface ProductGalleryProps {
  screenshots: string[];
}

export default function ProductGallery({ screenshots }: ProductGalleryProps) {
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <ImageGallery
          images={screenshots}
          getImageUrl={getSanityImageUrl}
          aspectRatio="video"
          altPrefix="Screenshot"
          showNavigation={screenshots.length > 1}
          showPagination={screenshots.length > 1}
        />
      </CardContent>
    </Card>
  );
}
