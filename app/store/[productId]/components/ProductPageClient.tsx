'use client';

import { motion } from 'framer-motion';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductFeatures from './ProductFeatures';
import ProductRequirements from './ProductRequirements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Monitor, ShoppingCart, Smartphone } from 'lucide-react';
import { IPremiumApp } from '@/types/premium-app';
import ProductGallery from './ProductGallery';
import { Button } from '@/components/ui/button';
import { useCartStore } from '../../store/cart';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductPageClientProps {
  product: IPremiumApp;
}

// Platform icons
const platformIcons: Record<string, React.ReactNode> = {
  globe: <Globe className="h-4 w-4 mr-1" />,
  monitor: <Monitor className="h-4 w-4 mr-1" />,
  smartphone: <Smartphone className="h-4 w-4 mr-1" />,
};

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart');
    router.push('/store/cart');
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <ProductImage
              title={product.title}
              mainImage={product.mainImage}
              tags={product.tags}
            />
            <ProductInfo product={product} />
          </div>

          {/* Screenshots Gallery */}
          {product.screenshots && product.screenshots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8"
            >
              <ProductGallery screenshots={product.screenshots} />
            </motion.div>
          )}

          {/* Platforms Section */}
          {product.platforms && product.platforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Available Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {product.platforms.map((platform) => (
                      <Badge
                        key={platform.slug.current}
                        variant="outline"
                        className="flex items-center text-base py-2 px-3"
                      >
                        {platformIcons[platform.icon] || null}
                        {platform.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-2 mt-8">
            <ProductFeatures features={product.features} />
            <ProductRequirements requirements={product.requirements} />
          </div>

          {/* Tags Section */}
          {product.tags && product.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end py-4">
            <Button onClick={handleAddToCart} size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
