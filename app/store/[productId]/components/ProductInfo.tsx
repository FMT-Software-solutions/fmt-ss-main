'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Define the ExtendedProduct type to match the one in ProductPageClient
interface ExtendedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  features: string[];
  requirements: {
    os: string[];
    processor: string;
    memory: string;
    storage: string;
  };
  platforms?: Array<{
    name: string;
    slug: { current: string };
    icon: string;
  }>;
  downloadUrl?: string | null;
  webAppUrl?: string | null;
}

interface ProductInfoProps {
  product: ExtendedProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const isFreeApp = product.price === 0;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      <p className="text-xl text-muted-foreground mb-6">
        {product.description}
      </p>
      <div className="flex items-center gap-4 mb-8">
        {!isFreeApp ? (
          <>
            <span className="text-3xl font-bold">${product.price}</span>
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </>
        ) : (
          <div className="flex flex-wrap gap-4 w-full">
            {product.downloadUrl && (
              <Button asChild className="flex items-center">
                <Link
                  href={product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Link>
              </Button>
            )}
            {product.webAppUrl && (
              <Button variant="outline" asChild className="flex items-center">
                <Link
                  href={product.webAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Open Web App
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
