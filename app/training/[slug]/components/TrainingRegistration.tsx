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
import { AlertCircle, ExternalLink } from 'lucide-react';
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

  // Check registration status based on new fields
  const getRegistrationStatus = () => {
    // If not published, registration should be disabled
    if (!training.isPublished) {
      return {
        canRegister: false,
        reason: 'draft',
        title: 'Training Not Available',
        description:
          'This training is currently in draft mode and not available for registration.',
        alertMessage: 'This training is not yet published.',
      };
    }

    // If registration is manually closed
    if (training.closeRegistration) {
      return {
        canRegister: false,
        reason: 'closed',
        title: 'Registration Closed',
        description: 'Registration for this training has been manually closed.',
        alertMessage: 'Registration has been closed by the administrator.',
      };
    }

    // If registration end date has passed
    if (training.registrationEndDate) {
      const now = new Date();
      const endDate = new Date(training.registrationEndDate);
      if (now > endDate) {
        return {
          canRegister: false,
          reason: 'expired',
          title: 'Registration Ended',
          description:
            'The registration deadline for this training has passed.',
          alertMessage: `Registration ended on ${endDate.toLocaleDateString()}.`,
        };
      }
    }

    // If training is full
    if (isFull) {
      return {
        canRegister: false,
        reason: 'full',
        title: 'Registration Closed',
        description: 'This training has reached maximum capacity.',
        alertMessage: `All ${maxParticipants} spots have been filled.`,
      };
    }

    return {
      canRegister: true,
      reason: 'open',
      title: training.isFree ? 'Register for Free' : 'Enroll Now',
      description: training.isFree
        ? 'Join this free training program'
        : 'Secure your spot in this training program',
      alertMessage: null,
    };
  };

  const registrationStatus = getRegistrationStatus();

  // Handle registration link logic
  const getRegistrationLink = () => {
    // Check if new registrationLink field exists
    if (training.registrationLink) {
      const { linkType, internalPath, externalUrl } = training.registrationLink;

      if (linkType === 'external' && externalUrl) {
        return {
          href: externalUrl,
          isExternal: true,
        };
      } else if (linkType === 'internal' && internalPath) {
        return {
          href: `/training/${training.slug.current}/register${internalPath}`,
          isExternal: false,
        };
      }
    }

    // Default behavior for backwards compatibility
    return {
      href: `/training/${training.slug.current}/register`,
      isExternal: false,
    };
  };

  const registrationLink = getRegistrationLink();
  const buttonText =
    training.registrationLink?.linkText ||
    (training.isFree ? 'Register Now' : 'Enroll Now');

  return (
    <Card
      className={`${
        !registrationStatus.canRegister
          ? 'bg-destructive/5 border-destructive/20'
          : 'bg-primary/5 border-primary/20'
      }`}
    >
      <CardHeader>
        <CardTitle>{registrationStatus.title}</CardTitle>
        <CardDescription>{registrationStatus.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!registrationStatus.canRegister ? (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {registrationStatus.alertMessage}
              </AlertDescription>
            </Alert>
            <p className="text-sm mb-6">
              {registrationStatus.reason === 'full'
                ? 'Please check back later for future sessions or contact us if you would like to be notified when new spots become available.'
                : registrationStatus.reason === 'expired'
                ? 'The registration deadline has passed. Please contact us for information about future sessions.'
                : registrationStatus.reason === 'closed'
                ? 'Registration has been temporarily closed. Please check back later or contact us for more information.'
                : 'This training is not currently available for registration.'}
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
                <Badge
                  variant={availableSpots < 5 ? 'destructive' : 'outline'}
                  className="hidden"
                >
                  {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'}{' '}
                  left
                </Badge>
              )}
            </div>

            {/* Registration deadline warning */}
            {training.registrationEndDate && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Registration closes on{' '}
                  {new Date(training.registrationEndDate).toLocaleDateString()}
                </AlertDescription>
              </Alert>
            )}

            {registrationLink.isExternal ? (
              <Button asChild className="w-full" size="lg">
                <Link
                  href={registrationLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  {buttonText}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full" size="lg">
                <Link href={registrationLink.href}>{buttonText}</Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
