'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code2,
  Users,
  Target,
  Building,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To build public projects and apps that address real challenges in
              Ghana across all sectors, while providing premium software
              solutions and training to businesses and individuals.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Our Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We identify gaps in various sectors where technology can make a
              significant impact, then develop sustainable and accessible
              solutions that address those specific needs.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Our Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              From mobile and web applications to comprehensive training
              programs, we combine technical excellence with local knowledge to
              create solutions that truly work for Ghana.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
