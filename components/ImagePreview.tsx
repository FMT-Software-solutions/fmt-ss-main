'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImagePreviewProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  altPrefix?: string;
}

export function ImagePreview({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  altPrefix = 'Image',
}: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset current index when images or initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [images, initialIndex]);

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <DialogTitle></DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative max-w-full max-h-[80vh]">
            <Image
              src={images[currentIndex]}
              alt={`${altPrefix} ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh]"
            />
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex gap-2 bg-black/30 px-3 py-1 rounded-full">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
