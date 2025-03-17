'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSanityImageUrl } from '@/lib/utils';

interface Instructor {
  name: string;
  bio: string;
  image: any; // Sanity image reference
}

interface TrainingInstructorProps {
  instructor: Instructor;
}

export default function TrainingInstructor({
  instructor,
}: TrainingInstructorProps) {
  const instructorImageUrl = getSanityImageUrl(instructor.image);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {instructorImageUrl && (
            <Image
              src={instructorImageUrl}
              alt={instructor.name}
              className="object-cover rounded-full"
              width={70}
              height={70}
            />
          )}
          <div>
            <h3 className="font-bold text-lg">{instructor.name}</h3>
            <p className="text-muted-foreground">{instructor.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
