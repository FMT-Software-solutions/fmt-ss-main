'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lightbulb, Download } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Innovative Software Solutions for Community Development
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Building public projects and premium applications that address 
            real challenges across all sectors to accelerate growth and progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/projects">
                <Lightbulb className="mr-2 h-5 w-5" />
                Explore Public Projects
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/store">
                <Download className="mr-2 h-5 w-5" />
                Get Premium Apps
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
