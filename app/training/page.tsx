"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { workshops } from './workshops';

export default function Training() {
  const router = useRouter();

  const upcomingTraining = workshops.filter(w => w.price > 0);
  const freeWorkshops = workshops.filter(w => w.price === 0);

  const handleRegistration = (workshopId: string) => {
    router.push(`/training/${workshopId}`);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Training & Workshops</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Level up your skills with our expert-led training sessions and workshops.
              From beginner to advanced, we have something for everyone.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Upcoming Training Sessions</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingTraining.map((training, index) => (
                <motion.div
                  key={training.id}
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
                        <Button onClick={() => handleRegistration(training.id)}>
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">Free Workshops</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {freeWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
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
                      <Button 
                        className="w-full"
                        onClick={() => handleRegistration(workshop.id)}
                      >
                        Register for Free
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}