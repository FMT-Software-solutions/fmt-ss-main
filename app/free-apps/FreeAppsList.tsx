import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { IFreeApp } from '@/types/free-app';
import { freeApps } from './data';

export default function FreeAppsList() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Free Applications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freeApps.map((app, index) => (
            <AppCard key={app._id} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface AppCardProps {
  app: IFreeApp;
  index: number;
}

function AppCard({ app, index }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={app.mainImage}
            alt={app.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="flex-1 pt-6">
          <h3 className="text-xl font-bold mb-2">{app.title}</h3>
          <p className="text-muted-foreground mb-4">{app.shortDescription}</p>
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {app.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          {app.downloadUrl && (
            <Button asChild variant="outline" size="sm">
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
          <Button asChild size="sm">
            <Link href={`/free-apps/${app.id}`}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Learn More
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
