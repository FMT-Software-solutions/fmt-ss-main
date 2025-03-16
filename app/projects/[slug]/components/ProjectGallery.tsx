'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImagePreview } from '@/components/ImagePreview';

// Fallback image
const fallbackImage =
  'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60';

export default function ProjectGallery({
  screenshots,
}: {
  screenshots: any[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  // Get image URL or use fallback
  const getImageUrl = (screenshot: any) => {
    if (!screenshot) return fallbackImage;

    const imageBuilder = urlForImage(screenshot);
    return imageBuilder ? imageBuilder.url() : fallbackImage;
  };

  // Convert screenshots to array of image URLs
  const imageUrls = screenshots.map(getImageUrl);

  return (
    <>
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
            <div className="relative">
              <div
                className="aspect-video relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              >
                <Image
                  src={getImageUrl(screenshots[currentIndex])}
                  alt={`Screenshot ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {screenshots.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {screenshots.length > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentIndex
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Use the reusable ImagePreview component */}
      <ImagePreview
        images={imageUrls}
        initialIndex={currentIndex}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        altPrefix="Screenshot"
      />
    </>
  );
}
