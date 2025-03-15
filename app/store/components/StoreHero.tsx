'use client';

import { motion } from 'framer-motion';

export default function StoreHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8">Software Store</h1>
    </motion.div>
  );
}
