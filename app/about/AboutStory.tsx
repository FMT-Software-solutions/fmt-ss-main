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
          address challenges and issues in Ghana through innovative software
          solutions. We identified gaps in various sectors where technology
          could make a significant impact on people's lives.
        </p>
        <p className="text-muted-foreground mb-4">
          Our first public projects focused on essential services like the Place
          Finder App, which helps users locate services near their current
          location. We've expanded to develop solutions for housing, public
          safety, and education.
        </p>
        <p className="text-muted-foreground">
          Today, we continue to grow by providing both public service apps and
          premium software solutions tailored to businesses and individuals,
          along with comprehensive training programs for aspiring developers.
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
