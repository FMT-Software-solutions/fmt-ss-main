'use client';

import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/ui/video-player';
import { IPremiumApp } from '@/types/premium-app';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cart';
import ProductCTA from './ProductCTA';
import ProductDescription from './ProductDescription';
import ProductFeatures from './ProductFeatures';
import ProductGallery from './ProductGallery';
import ProductHero from './ProductHero';
import ProductPlatforms from './ProductPlatforms';
import ProductRequirements from './ProductRequirements';
import ProductTags from './ProductTags';

interface ProductPageClientProps {
  product: IPremiumApp;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    addItem(product);
    router.push('/store/cart');
  };

  return (
    <div className="min-h-screen pb-16">
      <ProductHero
        product={product}
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
      />

      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductDescription product={product} />

          {/* Video Preview Section */}
          {product.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-12"
            >
              <div className="bg-card shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-2xl font-bold">
                    Watch {product.title} in Action
                  </h2>
                </div>
                <div className="p-4">
                  <VideoPlayer
                    videoUrl={product.videoUrl}
                    title={product.title}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="py-10">
            <ProductCTA
              product={product}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Screenshots Gallery */}
          {product.screenshots && product.screenshots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <ProductGallery screenshots={product.screenshots} />
            </motion.div>
          )}

          {/* Platforms Section */}
          {product.platforms && product.platforms.length > 0 && (
            <ProductPlatforms platforms={product.platforms} />
          )}

          {/* Features and Requirements */}
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <ProductFeatures features={product.features} />
            <ProductRequirements requirements={product.requirements} />
          </div>

          {/* Tags Section */}
          {product.tags && product.tags.length > 0 && (
            <ProductTags tags={product.tags} />
          )}

          {/* Final Call to Action */}
          <ProductCTA
            product={product}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />
        </motion.div>
      </div>
    </div>
  );
}
