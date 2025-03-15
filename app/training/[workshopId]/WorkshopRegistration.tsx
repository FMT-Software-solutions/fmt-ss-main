'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, GraduationCap, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Workshop } from '../workshops';

type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
};

export default function WorkshopRegistration({
  workshop,
}: {
  workshop: Workshop;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    experience: 'beginner',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (workshop.price > 0) {
      // Redirect to payment page with workshop and registration details
      router.push(
        `/training/${workshop.id}/payment?data=${encodeURIComponent(
          JSON.stringify(formData)
        )}`
      );
    } else {
      // Handle free workshop registration
      console.log('Free workshop registration:', formData);
      // TODO: Implement registration confirmation
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Workshop Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Starts {workshop.date}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Duration: {workshop.duration}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4" />
                    {workshop.spots} spots available
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Instructor: {workshop.instructor}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {workshop.curriculum.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Registration Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <RadioGroup
                        value={formData.experience}
                        onValueChange={(
                          value: 'beginner' | 'intermediate' | 'advanced'
                        ) => setFormData({ ...formData, experience: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner">Beginner</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="intermediate"
                            id="intermediate"
                          />
                          <Label htmlFor="intermediate">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="advanced" />
                          <Label htmlFor="advanced">Advanced</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full">
                      {workshop.price > 0
                        ? `Proceed to Payment ($${workshop.price})`
                        : 'Register for Free'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
