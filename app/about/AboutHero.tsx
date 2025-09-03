'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin } from 'lucide-react';

export default function AboutHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" />
      
      <div className="relative text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Innovating for Ghana's Future
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Building Tomorrow's
          <span className="text-primary block">Software Solutions</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're a <strong className="text-foreground">Ghanaian tech company</strong> dedicated to creating innovative software solutions that address real-world challenges and drive meaningful change across all sectors.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Based in Ghana, Serving the World</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2023</div>
            <div className="text-sm text-muted-foreground">Founded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">25</div>
            <div className="text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">120+</div>
            <div className="text-sm text-muted-foreground">Lives Impacted</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
