'use client';

import { motion } from 'framer-motion';
import { IEvent } from '@/types/event';
import { urlForImage } from '@/sanity/lib/image';
import {
  CalendarIcon,
  MapPinIcon,
  ExternalLinkIcon,
  Link2Icon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { VideoPlayer } from '@/components/ui/video-player';

interface EventDetailClientProps {
  event: IEvent;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const formattedStartDate = event.startDate
    ? format(new Date(event.startDate), 'MMMM d, yyyy - h:mm a')
    : '';

  const formattedEndDate = event.endDate
    ? format(new Date(event.endDate), 'MMMM d, yyyy - h:mm a')
    : '';

  // Validate if the joiningLink is a valid URL
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isValidJoiningLink = isValidUrl(event.joiningLink);

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div
              className="w-full aspect-[21/9] bg-cover bg-center"
              style={{
                backgroundImage: `url(${urlForImage(event.mainImage)
                  ?.width(1200)
                  .url()})`,
              }}
            />
            <div className="absolute inset-0 bg-black/50 flex items-end">
              <div className="p-6 md:p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="prose prose-lg max-w-none dark:prose-invert mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <div className="prose dark:prose-invert">
                  <PortableText value={event.description} />
                </div>
              </motion.div>

              {/* Video Preview */}
              {event.videoUrl && (
                <VideoPlayer videoUrl={event.videoUrl} title={event.title} />
              )}
            </div>

            {/* Event Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6 bg-card p-6 rounded-lg border"
            >
              <div>
                <h3 className="text-xl font-bold mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <CalendarIcon className="h-5 w-5 mr-3 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-muted-foreground">
                        {formattedStartDate}
                      </p>
                      {event.endDate && (
                        <p className="text-muted-foreground">
                          To: {formattedEndDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex">
                    <MapPinIcon className="h-5 w-5 mr-3 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">{event.location}</p>
                      {event.joiningLink && (
                        <div className="mt-2">
                          {isValidJoiningLink ? (
                            <Link
                              href={event.joiningLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                              >
                                <Link2Icon className="h-4 w-4 mr-2" />
                                {event.location.toLowerCase() === 'online'
                                  ? 'Join Event'
                                  : 'Get Directions'}
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {event.joiningLink}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Organized by</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
              </div>

              {event.registrationLink && (
                <Link
                  href={event.registrationLink}
                  target="_blank"
                  className="block"
                >
                  <Button className="w-full">
                    Register for Event
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}

              <Link href="/events" className="block">
                <Button variant="outline" className="w-full">
                  Back to Events
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
