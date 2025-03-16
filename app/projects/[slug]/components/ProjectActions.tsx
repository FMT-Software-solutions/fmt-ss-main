'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar, Tag, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { IPublicProject } from '@/types/public-project';

export default function ProjectActions({
  project,
}: {
  project: IPublicProject;
}) {
  const { status, sectors, publishedAt, projectUrl } = project;

  // Determine if the project URL should be enabled based on status
  const isUrlDisabled = status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project URL Button */}
          {projectUrl && (
            <div>
              <Button
                className="w-full"
                disabled={isUrlDisabled}
                onClick={() => {
                  if (!isUrlDisabled) {
                    window.open(projectUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {isUrlDisabled ? 'Coming Soon' : 'Visit Project'}
              </Button>
              {isUrlDisabled && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This project is not yet available for access
                </p>
              )}
            </div>
          )}

          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
              </div>
            </div>

            {sectors && sectors.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Sectors</p>
                  <p className="text-sm text-muted-foreground">
                    {sectors.map(
                      (sector, i) =>
                        `${sector}${sectors.length - 1 === i ? '' : ' | '} `
                    )}
                  </p>
                </div>
              </div>
            )}

            {publishedAt && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Published</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(publishedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
