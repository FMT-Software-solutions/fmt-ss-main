'use client';

import Image from 'next/image';
import type { Workshop } from '../../workshops';

interface WorkshopInfoProps {
  workshop: Workshop;
}

export default function WorkshopInfo({ workshop }: WorkshopInfoProps) {
  return (
    <div className="prose max-w-none mb-8">
      <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
      <p className="text-lg">{workshop.description}</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">What You'll Learn</h2>
      <ul className="space-y-2">
        {workshop.curriculum.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">About the Instructor</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={`/images/instructors/${workshop.instructor
              .toLowerCase()
              .replace(' ', '-')}.jpg`}
            alt={workshop.instructor}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium">{workshop.instructor}</h3>
          <p className="text-muted-foreground">Expert Trainer</p>
        </div>
      </div>
    </div>
  );
}
