'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'How are the training sessions conducted?',
    answer:
      'Our training sessions are conducted live online via Zoom. Each session includes interactive elements, hands-on exercises, and Q&A opportunities. For premium workshops, we also provide recordings afterward for your reference.',
  },
  {
    question: 'What do I need to prepare before attending a workshop?',
    answer:
      "For most workshops, you'll need a computer with a stable internet connection. Specific technical requirements (like software installations) will be sent to you before the workshop. We recommend having a development environment set up according to the pre-workshop instructions.",
  },
  {
    question: 'Are the workshops suitable for beginners?',
    answer:
      "We offer workshops for various skill levels. Each workshop description indicates the recommended experience level. If you're unsure, feel free to contact us, and we'll help you choose the right workshop for your skill level.",
  },
  {
    question: "Can I get a refund if I can't attend a paid workshop?",
    answer:
      "Yes, we offer full refunds if you cancel at least 7 days before the workshop date. For cancellations within 7 days, we offer a credit that can be applied to future workshops. If you can't attend, you can also transfer your spot to someone else.",
  },
  {
    question: 'Will I receive a certificate after completing a workshop?',
    answer:
      'Yes, all participants who complete a workshop receive a digital certificate of completion. For premium workshops, we also provide detailed feedback on your progress and areas for improvement.',
  },
  {
    question: 'How many participants are typically in a workshop?',
    answer:
      'We limit our workshops to ensure quality instruction. Free workshops typically have up to 30 participants, while premium workshops are limited to 15 participants to allow for more personalized attention.',
  },
];

export default function TrainingFaq() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <FaqItem key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ item, index }: { item: FaqItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left p-4 border-b focus:outline-none"
      >
        <span className="font-medium text-lg">{item.question}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-muted-foreground">{item.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
