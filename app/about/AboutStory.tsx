'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutStory() {
  return (
    <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        <p className="text-muted-foreground mb-4">
          Founded in 2023, FMT Software Solutions emerged from a vision to
          bridge the gap between premium software solutions and accessible
          learning resources. We believe that great software should be
          accompanied by great education.
        </p>
        <p className="text-muted-foreground">
          Today, we serve thousands of customers worldwide, providing both
          enterprise-grade software and comprehensive training programs that
          empower the next generation of tech leaders.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="relative aspect-video rounded-lg overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&auto=format&fit=crop&q=60"
          alt="Team collaboration"
          fill
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
