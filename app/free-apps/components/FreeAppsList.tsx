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
import { Download, ExternalLink, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IFreeAppListItem } from '@/types/free-app';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';
import { getSanityImageUrl } from '@/lib/utils';

interface FreeAppsListProps {
  freeApps: IFreeAppListItem[];
}

export default function FreeAppsList({ freeApps }: FreeAppsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter apps based on search query
  const filteredApps = freeApps.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      app.sectors?.some((sector) =>
        sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <Input
          placeholder="Search free apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredApps.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app, index) => (
            <AppCard key={app._id} app={app} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No apps found"
          description={
            freeApps.length === 0
              ? "We don't have any free apps available at the moment. Please check back later."
              : "We couldn't find any apps matching your search. Try a different search term."
          }
        >
          {freeApps.length > 0 && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          )}
        </EmptyState>
      )}
    </div>
  );
}

// Extracted to a separate component for better organization
function AppCard({ app, index }: { app: IFreeAppListItem; index: number }) {
  const imageUrl = getSanityImageUrl(app.mainImage);

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
              alt={app.title}
              fill
              className="object-cover"
            />
          </div>
          <CardTitle>{app.title}</CardTitle>
          <CardDescription>{app.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <h3 className="font-semibold mb-2">Key Features:</h3>
          <ul className="space-y-2 mb-6">
            {app.features.slice(0, 4).map((feature, i) => (
              <li
                key={i}
                className="flex items-center text-sm text-muted-foreground"
              >
                <span className="mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-auto">
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/free-apps/${app.slug.current}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn More
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
