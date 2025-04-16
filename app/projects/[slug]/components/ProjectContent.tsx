'use client';

import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoPlayer } from '@/components/ui/video-player';
import { IPublicProject } from '@/types/public-project';

const components = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-muted-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="ml-6 mb-4 list-disc space-y-2 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="ml-6 mb-4 list-decimal space-y-2 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export default function ProjectContent({
  project,
}: {
  project: IPublicProject;
}) {
  const { description, shortDescription, videoUrl } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
        </CardHeader>
        <CardContent>
          {shortDescription && (
            <p className="text-lg font-medium mb-6">{shortDescription}</p>
          )}
          {description && (
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <PortableText
                value={description}
                components={components as any}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Section */}
      {videoUrl && (
        <div className="mt-6">
          <VideoPlayer videoUrl={videoUrl} title={project.title} />
        </div>
      )}
    </motion.div>
  );
}
