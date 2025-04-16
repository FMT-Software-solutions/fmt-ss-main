'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ITraining } from '@/types/training';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TrainingRegistrationProps {
  training: ITraining;
}

export default function TrainingRegistration({
  training,
}: TrainingRegistrationProps) {
  // Check if registration is full
  const hasMaxParticipants = !!training.maxParticipants;
  const registeredParticipants = training.registeredParticipants || 0;
  const maxParticipants = training.maxParticipants || 0;
  const availableSpots = Math.max(0, maxParticipants - registeredParticipants);
  const isFull = hasMaxParticipants && availableSpots === 0;

  return (
    <Card
      className={`${isFull ? 'bg-destructive/5 border-destructive/20' : 'bg-primary/5 border-primary/20'}`}
    >
      <CardHeader>
        <CardTitle>
          {isFull
            ? 'Registration Closed'
            : training.isFree
              ? 'Register for Free'
              : 'Enroll Now'}
        </CardTitle>
        <CardDescription>
          {isFull
            ? 'This training has reached maximum capacity'
            : training.isFree
              ? 'Join this free training program'
              : 'Secure your spot in this training program'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFull ? (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All {maxParticipants} spots have been filled
              </AlertDescription>
            </Alert>
            <p className="text-sm mb-6">
              Please check back later for future sessions or contact us if you
              would like to be notified when new spots become available.
            </p>
            <Button asChild className="w-full" variant="outline" size="lg">
              <Link href="/training">Browse Other Trainings</Link>
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">
                {training.isFree ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>GHS{training.price}</span>
                )}
              </div>
              {hasMaxParticipants && (
                <Badge variant={availableSpots < 5 ? 'destructive' : 'outline'}>
                  {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'}{' '}
                  left
                </Badge>
              )}
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href={`/training/${training.slug.current}/register`}>
                {training.isFree ? 'Register Now' : 'Enroll Now'}
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
