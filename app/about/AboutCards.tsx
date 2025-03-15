'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Users, Target } from 'lucide-react';

export default function AboutCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code2 className="mr-2 h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To provide cutting-edge software solutions and comprehensive
            training that helps businesses and individuals thrive in the digital
            age.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Our Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A diverse group of passionate developers, designers, and educators
            committed to delivering excellence in every project and training
            session.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Our Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Innovation, quality, and customer success are at the heart of
            everything we do, driving our commitment to excellence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
