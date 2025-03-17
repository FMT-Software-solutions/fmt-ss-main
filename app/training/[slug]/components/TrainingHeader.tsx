'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Clock } from 'lucide-react';
import { ITraining } from '@/types/training';
import { getSanityImageUrl } from '@/lib/utils';
import { isDateInFuture } from '@/lib/date';

interface TrainingHeaderProps {
  training: ITraining;
}

export default function TrainingHeader({ training }: TrainingHeaderProps) {
  const imageUrl = getSanityImageUrl(training.mainImage);

  // Check if the training is upcoming
  const isUpcoming = training.startDate
    ? isDateInFuture(training.startDate)
    : false;

  return (
    <>
      <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
        <Image
          src={imageUrl}
          alt={training.title}
          fill
          className="object-cover"
        />
        {training.isFree && (
          <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm">
            Free
          </Badge>
        )}
        {isUpcoming && (
          <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm">
            Upcoming
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="outline" className="flex items-center">
          {training.trainingType.slug.current === 'online-live' ? (
            <Video className="h-4 w-4 mr-1" />
          ) : training.trainingType.slug.current === 'in-person' ? (
            <Users className="h-4 w-4 mr-1" />
          ) : (
            <Clock className="h-4 w-4 mr-1" />
          )}
          {training.trainingType.name}
        </Badge>
        {training.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
}
