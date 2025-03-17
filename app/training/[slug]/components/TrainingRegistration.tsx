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

interface TrainingRegistrationProps {
  training: ITraining;
}

export default function TrainingRegistration({
  training,
}: TrainingRegistrationProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>
          {training.isFree ? 'Register for Free' : 'Enroll Now'}
        </CardTitle>
        <CardDescription>
          {training.isFree
            ? 'Join this free training program'
            : 'Secure your spot in this training program'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold">
            {training.isFree ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>GHS{training.price}</span>
            )}
          </div>
          {training.maxParticipants && (
            <Badge variant="outline">
              {Math.max(
                0,
                training.maxParticipants -
                  (training.registeredParticipants || 0)
              )}{' '}
              spots left
            </Badge>
          )}
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href={`/training/${training.slug.current}/register`}>
            {training.isFree ? 'Register Now' : 'Enroll Now'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
