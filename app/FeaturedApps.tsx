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

// Data moved outside component to avoid recreation on each render
const featuredApps = [
  {
    id: 'project-manager-pro',
    title: 'Project Manager Pro',
    description:
      'Streamline your project management with our powerful solution',
    price: 299,
    image:
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'data-analyzer',
    title: 'Data Analyzer',
    description: 'Transform your data into actionable insights',
    price: 199,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'secure-vault',
    title: 'Secure Vault',
    description: 'Enterprise-grade security for your sensitive data',
    price: 249,
    image:
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60',
  },
];

export default function FeaturedApps() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Software Solutions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Extracted to a separate component for better organization
function AppCard({
  app,
  index,
}: {
  app: (typeof featuredApps)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{app.title}</CardTitle>
          <CardDescription>{app.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            <Image
              src={app.image}
              alt={app.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">${app.price}</span>
            <Button variant="secondary" asChild>
              <Link href={`/store/${app.id}`}>Learn More</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
