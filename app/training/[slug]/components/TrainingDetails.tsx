'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { ITraining } from '@/types/training';
import { formatDateTime, getRelativeTimeString } from '@/lib/date';

interface TrainingDetailsProps {
  training: ITraining;
}

export default function TrainingDetails({ training }: TrainingDetailsProps) {
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
            </div>
          </div>
        )}

        {training.maxParticipants && (
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Participants</p>
              <p className="text-muted-foreground">
                {training.registeredParticipants || 0} /{' '}
                {training.maxParticipants} registered
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
