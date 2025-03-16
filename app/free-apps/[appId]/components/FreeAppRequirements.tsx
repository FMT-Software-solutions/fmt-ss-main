'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IFreeApp } from '@/types/free-app';

interface FreeAppRequirementsProps {
  requirements: IFreeApp['requirements'];
}

export default function FreeAppRequirements({
  requirements,
}: FreeAppRequirementsProps) {
  if (!requirements) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.os && requirements.os.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1">Operating System</h3>
            <p className="text-muted-foreground">
              {requirements.os.join(', ')}
            </p>
          </div>
        )}

        {requirements.processor && (
          <div>
            <h3 className="font-semibold mb-1">Processor</h3>
            <p className="text-muted-foreground">{requirements.processor}</p>
          </div>
        )}

        {requirements.memory && (
          <div>
            <h3 className="font-semibold mb-1">Memory</h3>
            <p className="text-muted-foreground">{requirements.memory}</p>
          </div>
        )}

        {requirements.storage && (
          <div>
            <h3 className="font-semibold mb-1">Storage</h3>
            <p className="text-muted-foreground">{requirements.storage}</p>
          </div>
        )}

        {requirements.additionalRequirements &&
          requirements.additionalRequirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1">Additional Requirements</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {requirements.additionalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
