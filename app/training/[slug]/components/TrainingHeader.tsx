'use client';

import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Video, Monitor } from 'lucide-react';
import Image from 'next/image';
import { ITraining } from '@/types/training';
import { getSanityImageUrl } from '@/lib/utils';
import { formatCustom } from '@/lib/date';

interface TrainingHeaderProps {
  training: ITraining;
}

export default function TrainingHeader({ training }: TrainingHeaderProps) {
  const imageUrl = getSanityImageUrl(training.mainImage);

  // Get primary training type (backwards compatible)
  const getPrimaryTrainingType = () => {
    // Check new trainingTypes array first
    if (training.trainingTypes && training.trainingTypes.length > 0) {
      return training.trainingTypes[0];
    }
    // Fall back to old single trainingType
    if (training.trainingType) {
      return training.trainingType;
    }
    // Default fallback
    return {
      name: 'Training',
      slug: { current: 'general' },
    };
  };

  // Get icon based on training type
  const getTypeIcon = (typeSlug: string) => {
    if (typeSlug === 'online-live' || typeSlug === 'online')
      return <Video className="h-4 w-4 mr-1" />;
    if (typeSlug === 'in-person') return <Users className="h-4 w-4 mr-1" />;
    if (typeSlug === 'webinar') return <Monitor className="h-4 w-4 mr-1" />;
    return <Monitor className="h-4 w-4 mr-1" />; // Default icon
  };

  const primaryType = getPrimaryTrainingType();
  const typeSlug = primaryType.slug?.current || 'general';

  return (
    <div className="relative mb-6">
      <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={training.title}
          fill
          className="object-cover"
          priority
        />
        {training.isFree && (
          <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white">
            Free
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="flex items-center">
          {getTypeIcon(typeSlug)}
          {primaryType.name}
        </Badge>

        {training.startDate && (
          <Badge variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatCustom(training.startDate, 'MMM d, yyyy')}
          </Badge>
        )}

        {training.tags &&
          training.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
      </div>

      <h1 className="text-3xl font-bold mb-4">{training.title}</h1>
      <p className="text-lg text-muted-foreground mb-4">
        {training.shortDescription}
      </p>
    </div>
  );
}
