'use client';

import { motion } from 'framer-motion';

export default function TrainingHero() {
  return (
    <div className="py-12 md:py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Training Programs & Workshops
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Enhance your skills with our expert-led training sessions and workshops.
        From beginner to advanced levels, we offer both free and premium
        training options.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <span className="font-medium">Online Live</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <span className="font-medium">In-Person</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <span className="font-medium">Self-Paced</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
          <span className="font-medium">Free Workshops</span>
        </div>
      </div>
    </div>
  );
}
