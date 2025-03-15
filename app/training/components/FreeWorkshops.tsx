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
import { Calendar, Clock, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { workshops } from '../workshops';

export default function FreeWorkshops() {
  const router = useRouter();
  const freeWorkshops = workshops.filter((w) => w.price === 0);

  const handleRegistration = (workshopId: string) => {
    router.push(`/training/${workshopId}`);
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Free Workshops</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {freeWorkshops.map((workshop, index) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            index={index}
            onRegister={handleRegistration}
          />
        ))}
      </div>
    </section>
  );
}

// Extracted to a separate component for better organization
function WorkshopCard({
  workshop,
  index,
  onRegister,
}: {
  workshop: (typeof workshops)[0];
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
              src={workshop.image}
              alt={workshop.title}
              fill
              className="object-cover"
            />
          </div>
          <CardTitle>{workshop.title}</CardTitle>
          <CardDescription>{workshop.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              {workshop.date}
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              {workshop.duration}
            </div>
            <div className="flex items-center text-sm">
              <Video className="mr-2 h-4 w-4" />
              Live Online Session
            </div>
          </div>
          <Button className="w-full" onClick={() => onRegister(workshop.id)}>
            Register for Free
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
