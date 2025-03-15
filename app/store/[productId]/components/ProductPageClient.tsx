'use client';

import { motion } from 'framer-motion';
import type { Product } from '../products';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductFeatures from './ProductFeatures';
import ProductRequirements from './ProductRequirements';

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <ProductImage product={product} />
            <ProductInfo product={product} />
          </div>

          <div className="grid gap-8 md:grid-cols-2 mt-12">
            <ProductFeatures features={product.features} />
            <ProductRequirements requirements={product.requirements} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
