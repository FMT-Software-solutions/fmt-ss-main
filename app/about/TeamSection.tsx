'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Linkedin,
  Twitter,
  Github,
  Users,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const teamMembers = [
  {
    name: 'Shadrack Ankomahene',
    role: 'CEO & Founder, Lead Developer',
    bio:
      "Visionary leader passionate about transforming Ghana's tech landscape through innovative software solutions.",
    image: '/team/emmanuel.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/emmanuel-asante',
      twitter: 'https://twitter.com/emmanuel_asante',
      github: 'https://github.com/emmanuel-asante',
    },
  },
  {
    name: 'Franklin Luther',
    role: 'Senior Developer',
    bio:
      'Technical expert specializing in enterprise solutions and modern web technologies.',
    image: '/team/sarah.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/sarah-mensah',
      twitter: '#',
      github: 'https://github.com/sarah-mensah',
    },
  },
  {
    name: 'Maxwell Kwanning',
    role: 'Software Developer',
    bio:
      'Dedicated developer focused on creating impactful solutions for local businesses and communities.',
    image: '/team/cleopatra.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/cleopatra-opoku',
      twitter: '#',
      github: 'https://github.com/cleopatra-opoku',
    },
  },
  {
    name: 'John Fynn',
    role: 'Office manager & S.U.E',
    bio:
      'Experienced office manager with a deep understanding of software usage and customer expectations.',
    image: '/team/cleopatra.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/cleopatra-opoku',
      twitter: '#',
      github: 'https://github.com/cleopatra-opoku',
    },
  },
  {
    name: 'Cleopatra Opoku',
    role: 'HR',
    bio:
      'Experienced HR professional with a deep understanding of human resources and employee management.',
    image: '/team/cleopatra.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/cleopatra-opoku',
      twitter: '#',
      github: 'https://github.com/cleopatra-opoku',
    },
  },
  {
    name: 'Edem Awu',
    role: 'Support Specialist',
    bio:
      'Experienced support specialist with a deep understanding of customer service and support processes.',
    image: '/team/edem.jpg',
    skills: [],
    social: {
      linkedin: 'https://linkedin.com/in/edem',
      twitter: '#',
      github: 'https://github.com/edem-aws',
    },
  },
];

export default function TeamSection() {
  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <Users className="w-3 h-3 mr-1" />
          Our Team
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Meet the <span className="text-primary">Innovators</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our diverse team of passionate professionals brings together expertise
          from across the technology spectrum to deliver exceptional solutions.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  {/* <p className="text-sm text-muted-foreground mb-4">
                    {member.bio}
                  </p> */}
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className={cn('flex justify-center gap-3 ', 'hidden')}>
                  <a
                    href={member.social.linkedin}
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors duration-200"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors duration-200"
                    aria-label={`${member.name} Twitter`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.github}
                    className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors duration-200"
                    aria-label={`${member.name} GitHub`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Join Our Team CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl"
      >
        <h3 className="text-2xl font-bold mb-4">Join Our Growing Team</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          As we expand our impact across Ghana and beyond, we're looking for
          passionate developers and tech enthusiasts. Join our training programs
          or explore career opportunities with us.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Training Programs
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Heart className="w-4 h-4 mr-2" />
            Local Impact
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Growth Opportunities
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}
