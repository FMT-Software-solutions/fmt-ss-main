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
import {
  BookOpen,
  Download,
  GraduationCap,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Transform Your Business with Premium Software Solutions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              One-time purchases, free resources, and expert training to help
              your business thrive in the digital age.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" asChild>
                <Link href="/store">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Apps
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/free-apps">
                  <Download className="mr-2 h-5 w-5" />
                  Get Free Apps
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Apps */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Software Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredApps.map((app, index) => (
              <motion.div
                key={app.title}
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
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FMT Software Solutions?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for updates on new software releases,
              free resources, and upcoming training sessions.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

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

const features = [
  {
    title: 'One-Time Purchase',
    description: 'No recurring fees or hidden costs. Pay once, own forever.',
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Free Resources',
    description: 'Access a library of free tools and resources to get started.',
    icon: <Download className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Expert Training',
    description:
      'Learn from industry experts through our comprehensive training programs.',
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
  },
];
