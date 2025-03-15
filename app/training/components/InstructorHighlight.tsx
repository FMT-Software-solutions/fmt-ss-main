'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type Instructor = {
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise: string[];
};

const instructors: Instructor[] = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Lead Technical Trainer',
    bio: 'Dr. Johnson has over 15 years of experience in software development and technical training. She specializes in modern web technologies and has helped hundreds of developers advance their careers.',
    image: '/images/instructors/sarah-johnson.jpg',
    expertise: ['React', 'Next.js', 'TypeScript', 'Web Performance'],
  },
  {
    name: 'Michael Chen',
    role: 'Senior Developer Advocate',
    bio: 'Michael is passionate about teaching best practices in software development. With a background in both startups and enterprise companies, he brings practical insights to all his training sessions.',
    image: '/images/instructors/michael-chen.jpg',
    expertise: ['JavaScript', 'API Design', 'Testing', 'DevOps'],
  },
  {
    name: 'Aisha Patel',
    role: 'UX/UI Training Specialist',
    bio: 'Aisha combines her design background with technical expertise to deliver comprehensive UI/UX training. She focuses on creating accessible, beautiful, and functional user interfaces.',
    image: '/images/instructors/aisha-patel.jpg',
    expertise: [
      'UI Design',
      'Accessibility',
      'User Research',
      'Design Systems',
    ],
  },
];

export default function InstructorHighlight() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Meet Our Expert Instructors
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Learn from industry professionals with years of real-world experience.
        Our instructors are passionate about sharing their knowledge and helping
        you succeed.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {instructors.map((instructor, index) => (
          <InstructorCard
            key={instructor.name}
            instructor={instructor}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function InstructorCard({
  instructor,
  index,
}: {
  instructor: Instructor;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold">{instructor.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {instructor.role}
            </p>
            <p className="mb-4">{instructor.bio}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {instructor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
