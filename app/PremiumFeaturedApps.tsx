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
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import type { IPremiumAppListItem } from '@/types/premium-app';

const recentPremiumAppsQuery = groq`
  *[_type == "premiumApp" && isPublished == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    isPublished,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    features,
    platforms,
    tags,
    price,
    promotion {
      hasPromotion,
      discountPrice,
      isActive
    },
    publishedAt
  }
`;

export default function PremiumFeaturedApps() {
  const [apps, setApps] = useState<IPremiumAppListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          setIsLoading(false);
          return;
        }

        const data = await client.fetch(recentPremiumAppsQuery);
        setApps(data || []);
      } catch (err) {
        console.error('Error fetching recent premium apps:', err);
        setError('Failed to load apps. Sanity might not be properly configured.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApps();
  }, []);

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Premium Apps</h2>
        {error && (
          <div className="text-center py-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="h-[350px] flex flex-col animate-pulse">
                <CardHeader className="pb-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="aspect-video bg-muted rounded mb-4"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, index) => (
              <PremiumAppCard key={app._id} app={app} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PremiumAppCard({
  app,
  index,
}: {
  app: IPremiumAppListItem;
  index: number;
}) {
  const { title, slug, mainImage, shortDescription, sectors, promotion, price } = app;

  const finalPrice = promotion?.hasPromotion && promotion?.isActive && promotion?.discountPrice
    ? promotion.discountPrice
    : price;

  const fallbackImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60',
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle>{title}</CardTitle>
            {promotion?.hasPromotion && promotion?.isActive ? (
              <Badge className="bg-green-600">Promo</Badge>
            ) : (
              <Badge variant="outline">Premium</Badge>
            )}
          </div>
          <CardDescription>{shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            {mainImage ? (
              <Image
                src={urlForImage(mainImage)?.url() || fallbackImages[index % fallbackImages.length]}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <Image src={fallbackImages[index % fallbackImages.length]} alt={title} fill className="object-cover" />
            )}
          </div>
          <div className="flex justify-between items-center">
            {sectors && (
              <div className="flex items-center gap-1">
                {sectors.slice(0, 2).map((sector, i) => (
                  <Badge key={sector + i} variant="outline">
                    {sector}
                  </Badge>
                ))}
                {sectors?.length > 2 && <Badge variant="secondary">+{sectors.length - 2}</Badge>}
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="font-semibold">GHS {finalPrice}</span>
              <Button variant="secondary" asChild>
                <Link href={`/store/${slug.current}`}>View App</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}