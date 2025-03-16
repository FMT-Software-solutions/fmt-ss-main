'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreeApp } from '../../data';

interface FreeAppRequirementsProps {
  requirements: FreeApp['requirements'];
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
        {requirements.os && (
          <div>
            <h3 className="font-semibold mb-1">Operating System</h3>
            <p className="text-muted-foreground">
              {Array.isArray(requirements.os)
                ? requirements.os.join(', ')
                : requirements.os}
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
      </CardContent>
    </Card>
  );
}
