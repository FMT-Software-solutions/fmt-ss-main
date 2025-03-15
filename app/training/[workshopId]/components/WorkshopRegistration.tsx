'use client';

import { motion } from 'framer-motion';
import type { Workshop } from '../../workshops';
import WorkshopImage from './WorkshopImage';
import WorkshopInfo from './WorkshopInfo';
import WorkshopDetails from './WorkshopDetails';
import WorkshopShare from './WorkshopShare';

interface WorkshopRegistrationProps {
  workshop: Workshop;
}

export default function WorkshopRegistration({
  workshop,
}: WorkshopRegistrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <WorkshopImage workshop={workshop} />
          <WorkshopInfo workshop={workshop} />
        </div>

        <div>
          <WorkshopDetails workshop={workshop} />
          <WorkshopShare />
        </div>
      </div>
    </motion.div>
  );
}
