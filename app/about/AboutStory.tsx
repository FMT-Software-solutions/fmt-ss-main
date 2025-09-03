'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

const milestones = [
  {
    year: '2023',
    title: 'Foundation',
    description: "Started with a vision to transform Ghana's tech landscape",
  },
  {
    year: '2024',
    title: 'Enterprise Solutions',
    description:
      'Delivered multiple enterprise software solutions for local businesses',
  },
  {
    year: '2025',
    title: 'Training Launch',
    description:
      'Launched our first training session for beginner software developers in June',
  },
  {
    year: 'Future',
    title: 'Expansion Plans',
    description:
      'Planning to extend our reach to serve clients across multiple African countries',
  },
];

export default function AboutStory() {
  return (
    <div className="py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Badge variant="outline" className="mb-4">
            <Calendar className="w-3 h-3 mr-1" />
            Our Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Building the Future,{' '}
            <span className="text-primary">One Solution at a Time</span>
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              Founded in 2023, FMT Software Solutions was born from a simple
              belief: that technology should serve humanity, not the other way
              around. Starting in Ghana with a vision to transform the local
              tech landscape, we've dedicated ourselves to creating solutions
              that matter.
            </p>
            <p className="leading-relaxed">
              Over the past two years, what started as a passionate vision has
              evolved into a dynamic force for digital transformation. We've
              delivered 25 enterprise software solutions, helping businesses
              modernize their operations and communities connect through
              technology.
            </p>
            <p className="leading-relaxed">
              In June 2025, we launched our first training session for beginner
              software developers, marking our commitment to nurturing local
              talent. Our goal extends beyond just writing code - we're building
              an ecosystem where innovation thrives and technology becomes a
              bridge to opportunity for everyone in Ghana.
            </p>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Based in Ghana</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Global Impact</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>Excellence Driven</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/fmt-bg.png"
              alt="Team collaboration at FMT Software Solutions"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-20"
      >
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Journey</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Key milestones that have shaped our growth and impact in the
            technology landscape.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.8 }}
              className="relative"
            >
              <div className="bg-card border rounded-xl p-6 h-full hover:shadow-lg transition-shadow duration-300">
                <div className="text-2xl font-bold text-primary mb-2">
                  {milestone.year}
                </div>
                <h4 className="font-semibold mb-2">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
              {index < milestones.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
