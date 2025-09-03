'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';

export default function ContactHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl -z-10" />

        <div className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              Let's Connect
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to transform your business with custom software solutions?
              Our team is here to discuss your project, answer questions, and
              provide expert guidance.
            </p>
          </motion.div>

          {/* Quick info badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Clock className="w-4 h-4" />
              Response within 24 hours
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
            >
              <MapPin className="w-4 h-4" />
              Based in Ghana
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Users className="w-4 h-4" />
              Expert team ready to help
            </Badge>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
