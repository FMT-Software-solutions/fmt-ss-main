'use client';

import { ImagePreview } from '@/components/ImagePreview';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageGalleryProps {
  images: string[];
  alts?: string[];
  altPrefix?: string;
  aspectRatio?: 'video' | 'square' | 'auto' | 'custom';
  customAspectRatio?: string;
  className?: string;
  containerClassName?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  onSlideChange?: (index: number) => void;
  objectFit?: 'cover' | 'contain';
  initialSlide?: number;
  imageClassName?: string;
  fallbackImage?: string;
  enablePreview?: boolean;
  getImageUrl?: (image: string) => string;
}

export function ImageGallery({
  images,
  alts,
  altPrefix = 'Image',
  aspectRatio = 'video',
  customAspectRatio,
  className,
  containerClassName,
  showPagination = true,
  showNavigation = true,
  onSlideChange,
  objectFit = 'contain',
  initialSlide = 0,
  imageClassName,
  fallbackImage,
  enablePreview = true,
  getImageUrl = (image) => image,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Calculate aspect ratio class
  const aspectRatioClass =
    aspectRatio === 'custom'
      ? customAspectRatio
      : aspectRatio === 'square'
        ? 'aspect-square'
        : aspectRatio === 'video'
          ? 'aspect-video'
          : '';

  // Process images if needed
  const processedImages = images.map(getImageUrl);

  if (!images || images.length === 0) {
    return null;
  }

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setCurrentIndex(newIndex);
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  };

  const handleImageClick = () => {
    if (enablePreview) {
      setPreviewOpen(true);
    }
  };

  return (
    <>
      <div className={cn('w-full', containerClassName)}>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={showNavigation}
          pagination={showPagination ? { clickable: true } : false}
          onSlideChange={handleSlideChange}
          initialSlide={initialSlide}
          className={cn('w-full', className)}
        >
          {processedImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className={cn(
                  'relative cursor-pointer w-full',
                  aspectRatioClass
                )}
              >
                <Image
                  src={image || fallbackImage || ''}
                  alt={alts?.[index] || `${altPrefix} ${index + 1}`}
                  fill
                  className={cn(
                    `object-${objectFit} rounded-md`,
                    imageClassName
                  )}
                  onClick={handleImageClick}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {enablePreview && (
        <ImagePreview
          images={processedImages}
          initialIndex={currentIndex}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          altPrefix={altPrefix}
        />
      )}
    </>
  );
}
