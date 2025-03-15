'use client';

import { motion } from 'framer-motion';

export default function ContactHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about our products or services? We're here to help.
          Reach out to us and we'll get back to you as soon as possible.
        </p>
      </div>
    </motion.div>
  );
}
