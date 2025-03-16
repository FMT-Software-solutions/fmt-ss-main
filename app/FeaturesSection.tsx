'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Code, GraduationCap } from 'lucide-react';
import React from 'react';

// Features data moved outside component to avoid recreation on each render
const features = [
  {
    title: 'Public Projects',
    description:
      'Building innovative solutions that address real challenges across various sectors.',
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Custom Software',
    description:
      'Premium and free software solutions tailored for businesses and individuals.',
    icon: <Code className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Expert Training',
    description:
      'Comprehensive training programs and events to develop software development skills.',
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Extracted to a separate component for better organization
function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </motion.div>
  );
}
