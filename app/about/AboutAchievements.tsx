'use client';

import { Trophy } from 'lucide-react';

export default function AboutAchievements() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center">
          <Trophy className="h-12 w-12 text-primary mb-4" />
          <span className="text-4xl font-bold mb-2">10K+</span>
          <span className="text-muted-foreground">Active Users</span>
        </div>
        <div className="flex flex-col items-center">
          <Trophy className="h-12 w-12 text-primary mb-4" />
          <span className="text-4xl font-bold mb-2">500+</span>
          <span className="text-muted-foreground">Training Sessions</span>
        </div>
        <div className="flex flex-col items-center">
          <Trophy className="h-12 w-12 text-primary mb-4" />
          <span className="text-4xl font-bold mb-2">50+</span>
          <span className="text-muted-foreground">Countries Served</span>
        </div>
      </div>
    </div>
  );
}
