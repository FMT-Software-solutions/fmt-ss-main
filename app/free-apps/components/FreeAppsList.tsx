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

// Free apps data moved outside component to avoid recreation on each render
const freeApps = [
  {
    id: 'task-tracker',
    title: 'Task Tracker',
    description:
      'Simple and effective task management tool for individuals and small teams',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60',
    features: [
      'Task organization',
      'Due date tracking',
      'Priority levels',
      'Progress monitoring',
    ],
  },
  {
    id: 'code-snippet-manager',
    title: 'Code Snippet Manager',
    description: 'Store and organize your frequently used code snippets',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
    features: [
      'Syntax highlighting',
      'Tags and categories',
      'Search functionality',
      'Copy to clipboard',
    ],
  },
  {
    id: 'time-tracker',
    title: 'Time Tracker',
    description: 'Track time spent on projects and tasks',
    image:
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=60',
    features: [
      'Project time tracking',
      'Activity logs',
      'Basic reporting',
      'Export data',
    ],
  },
];

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
            {app.features.map((feature, i) => (
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
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
