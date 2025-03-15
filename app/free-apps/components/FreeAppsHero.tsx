'use client';

import { motion } from 'framer-motion';

export default function FreeAppsHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Free Applications</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of free tools designed to help you be more
          productive. No strings attached, just valuable resources for your
          success.
        </p>
      </div>
    </motion.div>
  );
}
