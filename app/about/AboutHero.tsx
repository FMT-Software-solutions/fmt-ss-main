'use client';

import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          About FMT Software Solutions
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          We're a Ghanaian startup dedicated to providing software solutions
          that address real challenges. Our primary goal is building public
          projects and apps that contribute to Ghana's development across all
          sectors.
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We also provide premium and free software solutions to businesses and
          individuals, along with comprehensive training programs and expert
          guidance in software development.
        </p>
      </div>
    </motion.div>
  );
}
