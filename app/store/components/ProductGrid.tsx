'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useFilters } from './StoreFilters';
import { IPremiumAppListItem } from '@/types/premium-app';
import { EmptyState } from '@/components/EmptyState';
import { PackageSearch } from 'lucide-react';
import { getSanityImageUrl } from '@/lib/utils';

interface ProductGridProps {
  premiumApps: IPremiumAppListItem[];
}

export default function ProductGrid({ premiumApps }: ProductGridProps) {
  const { search, category, sortBy } = useFilters();

  // Filter and sort products based on the filter context
  const filteredProducts = premiumApps
    .filter(
      (product) =>
        (product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.shortDescription
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          ) ||
          product.sectors?.some((sector) =>
            sector.toLowerCase().includes(search.toLowerCase())
          )) &&
        (category === 'all' || product.sectors?.includes(category))
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description={
          premiumApps.length === 0
            ? "We don't have any premium apps available at the moment. Please check back later."
            : "We couldn't find any products matching your filters. Try adjusting your search criteria."
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProducts.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}

// Extracted to a separate component for better organization
function ProductCard({
  product,
  index,
}: {
  product: IPremiumAppListItem;
  index: number;
}) {
  const imageUrl = getSanityImageUrl(product.mainImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>{product.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold">${product.price}</span>
            <Button asChild>
              <Link href={`/store/${product.slug.current}`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
