'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Globe } from 'lucide-react';
import { usePlatformConfig } from '@/hooks/use-platform-config';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ value, label, suffix = '', delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
          setHasAnimated(true);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, hasAnimated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: 'easeOut' }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center group cursor-pointer"
    >
      <div className="relative">
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-pink-600 dark:from-primary dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
          {count.toLocaleString()}
          {suffix}
        </div>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-pink-600 to-rose-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300">
          {count.toLocaleString()}
          {suffix}
        </div>
      </div>
      <div className="text-muted-foreground text-sm md:text-base font-semibold group-hover:text-foreground transition-colors duration-300">
        {label}
      </div>
    </motion.div>
  );
}

const platformBadges = [
  {
    icon: Globe,
    label: 'Web Apps',
    color:
      'bg-pink-500/10 text-primary dark:text-pink-400 border-pink-200 dark:bg-pink-500/5 dark:border-pink-600',
  },
  {
    icon: Monitor,
    label: 'Desktop Apps',
    color:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:bg-rose-500/5 dark:border-rose-500',
  },
  {
    icon: Smartphone,
    label: 'Mobile Apps',
    color:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:bg-purple-500/5 dark:border-purple-500',
  },
];

export function StatsSection() {
  const { config } = usePlatformConfig();

  if (!config?.user_feature_flags.stats_counter) {
    return null;
  }

  return (
    <section className="relative py-14 md:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-rose-500/5" />

        {/* Floating shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [-10, 10, -10],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/6 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-lg"
        />

        <motion.div
          animate={{
            y: [20, -10, 20],
            x: [10, -15, 10],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-gradient-to-br from-primary/15 to-pink-400/15 rounded-full blur-xl"
        />

        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [15, -10, 15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-md"
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] dark:bg-[linear-gradient(rgba(236,72,153,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,.01)_1px,transparent_1px)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
          <StatItem value={150} label="Apps Delivered" suffix="+" delay={0} />
          <StatItem value={25000} label="Active Users" suffix="+" delay={200} />
          <StatItem value={500000} label="Downloads" suffix="+" delay={400} />
          <StatItem
            value={50}
            label="Enterprise Clients"
            suffix="+"
            delay={600}
          />
        </div>

        {/* Platform Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-primary to-purple-800 dark:from-white dark:via-pink-200 dark:to-purple-200 bg-clip-text text-transparent">
            We Build For Every Platform
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {platformBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <Badge
                    variant="outline"
                    className={`px-6 py-3 text-base font-semibold ${badge.color} hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm border-2`}
                  >
                    <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    {badge.label}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent" />
    </section>
  );
}
