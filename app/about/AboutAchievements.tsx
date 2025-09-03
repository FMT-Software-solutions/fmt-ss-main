'use client';

import { Users, Code, Globe, Award, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const achievements = [
  {
    number: '120+',
    label: 'Lives Impacted',
    icon: Heart,
    description: 'Through our applications and solutions',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    number: '25',
    label: 'Projects Delivered',
    icon: Code,
    description: 'Across various industries and sectors',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    number: '95%',
    label: 'Customer Satisfaction',
    icon: Heart,
    description: 'Consistently delivering excellence',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    number: '80+',
    label: 'Training Hours',
    icon: TrendingUp,
    description: 'Empowering the next generation of developers',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    number: '2',
    label: 'Years of Excellence',
    icon: Award,
    description: 'Building innovative solutions since 2023',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    number: '100%',
    label: 'Commitment',
    icon: Users,
    description: 'Dedicated to transforming Ghana through technology',
    gradient: 'from-indigo-500 to-purple-500'
  },
];

export default function AboutAchievements() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Impact by the <span className="text-primary">Numbers</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our achievements reflect our commitment to excellence, innovation, and meaningful impact 
          in the communities we serve.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${achievement.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {achievement.number}
                  </div>
                  <div className="font-semibold text-lg mb-2">{achievement.label}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Call to Action */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.8 }}
         className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl"
       >
         <h3 className="text-2xl font-bold mb-4">Ready to Be Part of Our Story?</h3>
         <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
           Join our growing community of satisfied clients in Ghana who have transformed their businesses 
           with our innovative solutions. As we expand across Africa, let's build something amazing together.
         </p>
       </motion.div>
    </div>
  );
}
