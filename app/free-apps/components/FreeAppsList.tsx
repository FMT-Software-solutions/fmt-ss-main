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
import { Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { freeApps } from '../data';

export default function FreeAppsList() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {freeApps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </div>
  );
}

// Extracted to a separate component for better organization
function AppCard({ app, index }: { app: (typeof freeApps)[0]; index: number }) {
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
              src={app.image}
              alt={app.title}
              fill
              className="object-cover"
            />
          </div>
          <CardTitle>{app.title}</CardTitle>
          <CardDescription>{app.description}</CardDescription>
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
            {app.downloadUrl && (
              <Button asChild className="flex-1">
                <Link
                  href={app.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/free-apps/${app.id}`}>
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
