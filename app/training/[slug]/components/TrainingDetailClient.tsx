'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ITraining } from '@/types/training';
import TrainingHeader from './TrainingHeader';
import TrainingDetails from './TrainingDetails';
import TrainingInstructor from './TrainingInstructor';
import TrainingContent from './TrainingContent';
import TrainingRegistration from './TrainingRegistration';
import { VideoPlayer } from '@/components/ui/video-player';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TrainingDetailClientProps {
  training: ITraining;
}

export default function TrainingDetailClient({
  training,
}: TrainingDetailClientProps) {
  const searchParams = useSearchParams();
  const [showRegistrationFullAlert, setShowRegistrationFullAlert] = useState(
    false
  );

  useEffect(() => {
    // Check if user was redirected due to full registration
    if (searchParams.get('registration') === 'full') {
      setShowRegistrationFullAlert(true);

      // Auto-hide alert after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationFullAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-7xl">
        {showRegistrationFullAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Registration Full</AlertTitle>
              <AlertDescription>
                This training program has reached its maximum capacity and is no
                longer accepting registrations.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column - Image and Details */}
            <div>
              <TrainingHeader training={training} />
              <TrainingDetails training={training} />
              <TrainingInstructor instructor={training.instructor} />
            </div>

            {/* Right Column - Content and Registration */}
            <div>
              <TrainingContent training={training} />
              <TrainingRegistration training={training} />
            </div>
          </div>

          {/* Video Preview */}
          {training.videoUrl && (
            <div className="mt-8">
              <VideoPlayer
                videoUrl={training.videoUrl}
                title={training.title}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
