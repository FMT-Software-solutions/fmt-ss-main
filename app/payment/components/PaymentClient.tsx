'use client';

import { motion } from 'framer-motion';
import type { Workshop } from '../../../workshops';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';

interface PaymentClientProps {
  workshop: Workshop;
  registrationData: any;
}

export default function PaymentClient({
  workshop,
  registrationData,
}: PaymentClientProps) {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

          <OrderSummary workshop={workshop} />
          <PaymentForm
            workshop={workshop}
            registrationData={registrationData}
          />
        </motion.div>
      </div>
    </div>
  );
}
