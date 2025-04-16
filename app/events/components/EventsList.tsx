'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { IEventListItem } from '@/types/event';
import { urlForImage } from '@/sanity/lib/image';
import { format } from 'date-fns';

interface EventsListProps {
  events: IEventListItem[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <motion.div
          key={event._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/events/${event.slug.current}`}>
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${urlForImage(event.mainImage)
                    ?.width(600)
                    .height(340)
                    .url()})`,
                }}
              />
            </Link>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Link
                  href={`/events/${event.slug.current}`}
                  className="text-xl font-bold hover:text-primary transition-colors line-clamp-2"
                >
                  {event.title}
                </Link>
                {event.featured && (
                  <Badge variant="outline" className="ml-2 shrink-0">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {event.shortDescription}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {format(new Date(event.startDate), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/events/${event.slug.current}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
