'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';
import { ITraining } from '@/types/training';
import { formatDateTime, getRelativeTimeString } from '@/lib/date';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrainingDetailsProps {
  training: ITraining;
}

export default function TrainingDetails({ training }: TrainingDetailsProps) {
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

  const isValidJoiningLink = isValidUrl(training.joiningLink);

  // Calculate registration status
  const hasMaxParticipants = !!training.maxParticipants;
  const registeredParticipants = training.registeredParticipants || 0;
  const maxParticipants = training.maxParticipants || 0;
  const availableSpots = Math.max(0, maxParticipants - registeredParticipants);
  const isFull = hasMaxParticipants && availableSpots === 0;
  const registrationPercentage = hasMaxParticipants
    ? Math.min(100, (registeredParticipants / maxParticipants) * 100)
    : 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Training Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
          <div>
            <p className="font-medium">Duration</p>
            <p className="text-muted-foreground">{training.duration}</p>
          </div>
        </div>

        {training.startDate && (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-muted-foreground">
                {formatDateTime(training.startDate)}
                {training.endDate && ` - ${formatDateTime(training.endDate)}`}
                <span className="block text-sm mt-1 text-primary">
                  {getRelativeTimeString(training.startDate)}
                </span>
              </p>
            </div>
          </div>
        )}

        {training.location && (
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">{training.location}</p>
              {training.joiningLink && (
                <div className="mt-2">
                  {isValidJoiningLink ? (
                    <Link
                      href={training.joiningLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {training.location.toLowerCase() === 'online'
                          ? 'Join Session'
                          : 'Get Directions'}
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {training.joiningLink}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {hasMaxParticipants && (
          <div className="flex items-start">
            <Users className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Registration Status</p>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground">
                  {registeredParticipants} / {maxParticipants} registered
                </p>
                {isFull && (
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Full
                  </Badge>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isFull ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${registrationPercentage}%` }}
                ></div>
              </div>
              {isFull && (
                <div className="flex items-center mt-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Registration is closed for this training</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
