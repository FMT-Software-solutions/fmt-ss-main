'use client';

import { Button } from '@/components/ui/button';
import { IPremiumApp } from '@/types/premium-app';
import { motion } from 'framer-motion';
import { CreditCard, ShoppingCart } from 'lucide-react';

interface ProductHeroProps {
  product: IPremiumApp;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export default function ProductHero({
  product,
  onBuyNow,
  onAddToCart,
}: ProductHeroProps) {
  return (
    <div className="bg-gradient-to-r from-primary/80 to-accent/80 dark:from-primary/60 dark:to-accent/60 text-primary-foreground py-16 mb-8">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            {product.title}
          </h1>
          <p className="text-base md:text-xl mb-8 opacity-90 text-gray-900 dark:text-gray-200">
            {product.shortDescription}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <div className="text-2xl md:text-4xl font-bold bg-background/10 backdrop-blur-sm px-6 py-2 rounded-lg text-primary dark:text-white">
              <span className="text-base  opacity-70 mr-1">GHS</span>
              {product.price}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onBuyNow}
                size="lg"
                variant="default"
                className="bg-white text-primary hover:bg-white/90"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                onClick={onAddToCart}
                size="lg"
                variant="outline"
                className="bg-white/20 dark:bg-black/50 border-white/50 hover:bg-white/20 text-gray-800 dark:text-gray-200"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
