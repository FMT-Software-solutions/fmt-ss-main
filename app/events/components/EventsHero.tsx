'use client';

import { motion } from 'framer-motion';

export default function EventsHero() {
  return (
    <div className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Events</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-6">
            Join us at our upcoming events to learn, connect, and grow. Our
            events are designed to help you enhance your skills and network with
            others in the software development industry.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
