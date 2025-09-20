'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen } from 'lucide-react';
import { ITraining } from '@/types/training';
import { PortableText } from '@portabletext/react';
import TrainingRegistration from './TrainingRegistration';

interface TrainingContentProps {
  training: ITraining;
}

export default function TrainingContent({ training }: TrainingContentProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{training.title}</h1>
      <div className="prose max-w-none mb-8">
        {training.description && <PortableText value={training.description} />}
      </div>
      <div className="my-4">
        <TrainingRegistration training={training} />
      </div>

      {/* Prerequisites */}
      {training.prerequisites && training.prerequisites.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {training.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{prerequisite}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Syllabus */}
      {training.syllabus && training.syllabus.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Syllabus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {training.syllabus.map((item, index) => (
                <div key={index}>
                  <h3 className="font-medium flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground ml-7">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
