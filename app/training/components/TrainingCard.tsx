'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ITrainingListItem } from '@/types/training';
import { getSanityImageUrl } from '@/lib/utils';
import { formatDate, formatCustom } from '@/lib/date';

interface TrainingCardProps {
  training: ITrainingListItem;
}

export default function TrainingCard({ training }: TrainingCardProps) {
  const imageUrl = getSanityImageUrl(training.mainImage);

  // Get icon based on training type
  const getTypeIcon = () => {
    const type = training.trainingType.slug.current;
    if (type === 'online-live') return <Video className="h-4 w-4 mr-1" />;
    if (type === 'in-person') return <Users className="h-4 w-4 mr-1" />;
    if (type === 'self-paced') return <Clock className="h-4 w-4 mr-1" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={training.title}
            fill
            className="object-cover"
          />
          {training.isFree && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              Free
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="flex items-center">
              {getTypeIcon()}
              {training.trainingType.name}
            </Badge>
            {training.startDate && (
              <Badge variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatCustom(training.startDate, 'MMM d')}
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2">{training.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {training.shortDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>{training.duration}</span>
          </div>
          {training.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{training.location}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="font-bold">
            {training.isFree ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>GHS{training.price}</span>
            )}
          </div>
          <Button asChild>
            <Link href={`/training/${training.slug.current}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
