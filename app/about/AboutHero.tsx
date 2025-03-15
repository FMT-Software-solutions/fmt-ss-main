'use client';

import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          About FMT Software Solutions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to empower businesses and developers with premium
          software solutions and expert training that drives innovation and
          success.
        </p>
      </div>
    </motion.div>
  );
}
