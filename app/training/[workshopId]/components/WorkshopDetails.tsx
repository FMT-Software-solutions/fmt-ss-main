'use client';

import { Calendar, Clock, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Workshop } from '../../workshops';

interface WorkshopDetailsProps {
  workshop: Workshop;
}

export default function WorkshopDetails({ workshop }: WorkshopDetailsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Workshop Details</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{workshop.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{workshop.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-muted-foreground">
                    {workshop.spots} spots remaining
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Instructor</p>
                  <p className="text-muted-foreground">{workshop.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">Price</span>
              <span className="text-2xl font-bold">
                {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
              </span>
            </div>
            <Button className="w-full" size="lg">
              {workshop.price === 0 ? 'Register Now' : 'Enroll Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
