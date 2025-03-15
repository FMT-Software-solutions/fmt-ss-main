'use client';

import { motion } from 'framer-motion';

export default function TrainingHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Training & Workshops</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Level up your skills with our expert-led training sessions and
          workshops. From beginner to advanced, we have something for everyone.
        </p>
      </div>
    </motion.div>
  );
}
