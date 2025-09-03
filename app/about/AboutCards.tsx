'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Target,
  Rocket,
  Heart,
  Globe,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    description: "Empowering Ghana through innovative technology solutions that address real challenges and create lasting impact across all sectors of society.",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Innovation, integrity, and impact drive everything we do. We believe in building solutions that truly matter to the communities we serve.",
    gradient: "from-pink-500/10 to-rose-500/10"
  },
  {
    icon: Rocket,
    title: "Our Vision",
    description: "To be the leading technology partner for Ghana's digital transformation, creating solutions that inspire and enable progress.",
    gradient: "from-purple-500/10 to-indigo-500/10"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "While rooted in Ghana, our solutions serve businesses and communities worldwide, bringing local insights to global challenges.",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "We prioritize community impact, building solutions that strengthen local ecosystems and empower individuals and businesses.",
    gradient: "from-orange-500/10 to-amber-500/10"
  },
  {
    icon: Zap,
    title: "Innovation First",
    description: "Cutting-edge technology meets practical application. We leverage the latest tools to solve tomorrow's challenges today.",
    gradient: "from-violet-500/10 to-purple-500/10"
  }
];

export default function AboutCards() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our core principles and values that guide every project, partnership, and innovation we pursue.
        </p>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
