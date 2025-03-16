'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { FreeApp } from '../../data';

interface FreeAppGalleryProps {
  screenshots: FreeApp['screenshots'];
}

export default function FreeAppGallery({ screenshots }: FreeAppGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-0 relative h-[400px] md:h-[500px]">
          <Image
            src={screenshots[currentIndex]}
            alt={`Screenshot ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
          {screenshots.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center gap-2 mt-2">
            {screenshots.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? 'default' : 'outline'}
                size="icon"
                className="w-3 h-3 p-0 rounded-full"
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
