'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCustom } from '@/lib/date';
import { getSanityImageUrl } from '@/lib/utils';
import { ITrainingListItem } from '@/types/training';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrainingCardProps {
  training: ITrainingListItem;
}

export default function TrainingCard({ training }: TrainingCardProps) {
  const imageUrl = getSanityImageUrl(training.mainImage);

  // Check registration status
  const getRegistrationStatus = () => {
    // If not published, shouldn't be visible (but just in case)
    if (!training.isPublished) {
      return { status: 'draft', label: 'Draft', color: 'bg-gray-500' };
    }

    // If registration is manually closed
    if (training.closeRegistration) {
      return {
        status: 'closed',
        label: 'Registration Closed',
        color: 'bg-red-500',
      };
    }

    // If registration end date has passed
    if (training.registrationEndDate) {
      const now = new Date();
      const endDate = new Date(training.registrationEndDate);
      if (now > endDate) {
        return {
          status: 'expired',
          label: 'Registration Ended',
          color: 'bg-orange-500',
        };
      }
    }

    return {
      status: 'open',
      label: 'Registration Open',
      color: 'bg-green-500',
    };
  };

  const registrationStatus = getRegistrationStatus();

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
  const getTypeIcon = (type: string) => {
    if (type === 'online-live' || type === 'online')
      return <Video className="h-4 w-4 mr-1" />;
    if (type === 'in-person') return <Users className="h-4 w-4 mr-1" />;
    if (type === 'self-paced') return <Clock className="h-4 w-4 mr-1" />;
    if (type === 'webinar') return <Monitor className="h-4 w-4 mr-1" />;
    return <Monitor className="h-4 w-4 mr-1" />; // Default icon
  };

  // Get all training types for display
  const getAllTrainingTypes = () => {
    if (training.trainingTypes && training.trainingTypes.length > 0) {
      return training.trainingTypes;
    }
    if (training.trainingType) {
      return [training.trainingType];
    }
    return [
      {
        name: 'Training',
        slug: { current: 'general' },
      },
    ];
  };

  const allTypes = getAllTrainingTypes();

  // Display logic: show up to 2 types, then "+X more"
  const typesToShow = allTypes.slice(0, 2);
  const remainingTypes = allTypes.slice(2);
  const hasMoreTypes = remainingTypes.length > 0;

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
          {/* Registration Status Badge */}
          <Badge
            className={`absolute top-2 left-2 ${registrationStatus.color} hover:${registrationStatus.color} text-white flex items-center gap-1`}
          >
            {registrationStatus.status === 'open' ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {registrationStatus.label}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* Display up to 2 training types */}
            {typesToShow.map((type, index) => {
              const typeSlug = type.slug?.current || 'general';
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center"
                >
                  {getTypeIcon(typeSlug)}
                  {type.name}
                </Badge>
              );
            })}

            {/* Display "+X more" with tooltip for remaining types */}
            {hasMoreTypes && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help">
                      +{remainingTypes.length} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium text-xs">All Training Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {allTypes.map((type, index) => (
                          <span
                            key={index}
                            className="inline-block bg-muted px-2 py-1 rounded text-xs"
                          >
                            {type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

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
          <div className="flex flex-col items-end gap-2">
            {registrationStatus.status !== 'open' && (
              <span className="text-xs text-muted-foreground">
                {registrationStatus.label}
              </span>
            )}
            <Button asChild>
              <Link href={`/training/${training.slug.current}`}>
                View Details
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
