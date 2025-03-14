'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Users, Trophy, Target } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              About FMT Software Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to empower businesses and developers with
              premium software solutions and expert training that drives
              innovation and success.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code2 className="mr-2 h-5 w-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide cutting-edge software solutions and comprehensive
                  training that helps businesses and individuals thrive in the
                  digital age.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Our Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A diverse group of passionate developers, designers, and
                  educators committed to delivering excellence in every project
                  and training session.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Innovation, quality, and customer success are at the heart of
                  everything we do, driving our commitment to excellence.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2020, FMT Software Solutions emerged from a vision to
                bridge the gap between premium software solutions and accessible
                learning resources. We believe that great software should be
                accompanied by great education.
              </p>
              <p className="text-muted-foreground">
                Today, we serve thousands of customers worldwide, providing both
                enterprise-grade software and comprehensive training programs
                that empower the next generation of tech leaders.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-video rounded-lg overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <span className="text-4xl font-bold mb-2">10K+</span>
                <span className="text-muted-foreground">Active Users</span>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <span className="text-4xl font-bold mb-2">500+</span>
                <span className="text-muted-foreground">Training Sessions</span>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <span className="text-4xl font-bold mb-2">50+</span>
                <span className="text-muted-foreground">Countries Served</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
