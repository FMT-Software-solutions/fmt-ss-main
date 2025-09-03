'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Building2, 
  GraduationCap, 
  Globe, 
  Shield, 
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

const focusAreas = [
  {
    icon: Smartphone,
    title: "Public Service Apps",
    description: "Developing innovative applications that address real challenges in Ghana, from location services to public safety solutions that serve communities.",
    features: ["Location Services", "Public Safety", "Government Services", "Community Tools"],
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconGradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Building2,
    title: "Business Solutions",
    description: "Custom software development for businesses looking to digitize their operations, improve efficiency, and scale their impact.",
    features: ["Custom Development", "Digital Transformation", "Process Automation", "Enterprise Solutions"],
    gradient: "from-purple-500/10 to-indigo-500/10",
    iconGradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: GraduationCap,
    title: "Training & Education",
    description: "Comprehensive training programs for individuals and organizations to build technical skills and capabilities in modern technology.",
    features: ["Skills Development", "Technical Training", "Certification Programs", "Mentorship"],
    gradient: "from-green-500/10 to-emerald-500/10",
    iconGradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Globe,
    title: "Digital Innovation",
    description: "Pioneering digital solutions that leverage cutting-edge technology to solve complex problems and create new opportunities.",
    features: ["AI Integration", "Cloud Solutions", "IoT Development", "Blockchain"],
    gradient: "from-orange-500/10 to-amber-500/10",
    iconGradient: "from-orange-500 to-amber-500"
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Ensuring robust security measures and compliance standards across all our solutions to protect data and maintain trust.",
    features: ["Data Protection", "Security Audits", "Compliance", "Risk Management"],
    gradient: "from-red-500/10 to-pink-500/10",
    iconGradient: "from-red-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Optimizing applications and systems for maximum performance, scalability, and user experience across all platforms.",
    features: ["Performance Tuning", "Scalability", "User Experience", "System Optimization"],
    gradient: "from-violet-500/10 to-purple-500/10",
    iconGradient: "from-violet-500 to-purple-500"
  }
];

export default function FocusAreas() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <Target className="w-3 h-3 mr-1" />
          Our Expertise
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Areas of <span className="text-primary">Excellence</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          We specialize in diverse technology domains, delivering comprehensive solutions 
          that drive innovation and create lasting impact across multiple sectors.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {focusAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.iconGradient} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground mb-3">Key Services:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {area.features.map((feature) => (
                        <div key={feature} className="flex items-center text-xs text-muted-foreground">
                          <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Ideas?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Whether you need a custom application, want to digitize your business processes, 
          or require technical training, we have the expertise to bring your vision to life.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Free Consultation</Badge>
          <Badge variant="secondary">Custom Solutions</Badge>
          <Badge variant="secondary">Expert Support</Badge>
        </div>
      </motion.div>
    </div>
  );
}