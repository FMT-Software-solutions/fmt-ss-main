'use client';

import { motion } from 'framer-motion';
import { FreeApp } from '../../data';
import { IFreeApp } from '@/types/free-app';
import FreeAppImage from './FreeAppImage';
import FreeAppInfo from './FreeAppInfo';
import FreeAppFeatures from './FreeAppFeatures';
import FreeAppRequirements from './FreeAppRequirements';
import FreeAppPlatforms from './FreeAppPlatforms';
import FreeAppGallery from './FreeAppGallery';
import { Badge } from '@/components/ui/badge';

interface FreeAppPageClientProps {
  app: IFreeApp;
}

export default function FreeAppPageClient({ app }: FreeAppPageClientProps) {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <FreeAppImage app={app} />
            <FreeAppInfo app={app} />
          </div>

          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8"
            >
              <FreeAppGallery screenshots={app.screenshots} />
            </motion.div>
          )}

          {/* Platforms Section */}
          {app.platforms && app.platforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <FreeAppPlatforms platforms={app.platforms} />
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-2 mt-8">
            <FreeAppFeatures features={app.features} />
            <FreeAppRequirements requirements={app.requirements} />
          </div>

          {/* Tags Section */}
          {app.tags && app.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
