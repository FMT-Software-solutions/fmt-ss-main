'use client';

import { motion } from 'framer-motion';

export default function ProjectsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Public Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our innovative solutions addressing real challenges across
          various sectors to accelerate growth and progress.
        </p>
      </div>
    </motion.div>
  );
}
