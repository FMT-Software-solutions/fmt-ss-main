'use client';

import { motion } from 'framer-motion';
import { ITraining } from '@/types/training';
import TrainingHeader from './TrainingHeader';
import TrainingDetails from './TrainingDetails';
import TrainingInstructor from './TrainingInstructor';
import TrainingContent from './TrainingContent';
import TrainingRegistration from './TrainingRegistration';

interface TrainingDetailClientProps {
  training: ITraining;
}

export default function TrainingDetailClient({
  training,
}: TrainingDetailClientProps) {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
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
        </motion.div>
      </div>
    </div>
  );
}
