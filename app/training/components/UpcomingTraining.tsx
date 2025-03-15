'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { workshops } from '../workshops';

export default function UpcomingTraining() {
  const router = useRouter();
  const upcomingTraining = workshops.filter((w) => w.price > 0);

  const handleRegistration = (workshopId: string) => {
    router.push(`/training/${workshopId}`);
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Upcoming Training Sessions</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {upcomingTraining.map((training, index) => (
          <TrainingCard
            key={training.id}
            training={training}
            index={index}
            onRegister={handleRegistration}
          />
        ))}
      </div>
    </section>
  );
}

// Extracted to a separate component for better organization
function TrainingCard({
  training,
  index,
  onRegister,
}: {
  training: (typeof workshops)[0];
  index: number;
  onRegister: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
            <Image
              src={training.image}
              alt={training.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-start mb-2">
            <CardTitle>{training.title}</CardTitle>
            <Badge variant="secondary">{training.type}</Badge>
          </div>
          <CardDescription>{training.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Starts {training.date}
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              Duration: {training.duration}
            </div>
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4" />
              {training.spots} spots available
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold">${training.price}</span>
            <Button onClick={() => onRegister(training.id)}>Enroll Now</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
