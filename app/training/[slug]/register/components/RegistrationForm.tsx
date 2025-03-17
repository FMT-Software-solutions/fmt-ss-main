'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ITraining } from '@/types/training';
import { formatCustom, getRelativeTimeString } from '@/lib/date';
import { getSanityImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  company: z.string().optional(),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  training: ITraining;
}

export default function RegistrationForm({ training }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const imageUrl = getSanityImageUrl(training.mainImage);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      agreeToTerms: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Registration successful!',
        description:
          'You have successfully registered for this training program.',
      });

      // Redirect to a thank you page or back to the training page
      router.push(`/training/${training.slug.current}/thank-you`);
    } catch (error) {
      toast({
        title: 'Registration failed',
        description:
          'There was an error processing your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements or questions?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormDescription>
                      I agree to the terms of service and privacy policy.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : training.isFree
                  ? 'Register Now'
                  : 'Complete Registration'}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              <Image
                src={imageUrl}
                alt={training.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-lg mb-2">{training.title}</h3>
            <div className="text-sm text-muted-foreground mb-4">
              {training.startDate && (
                <p className="mb-1">
                  <span className="font-medium">Date:</span>{' '}
                  {formatCustom(training.startDate, 'EEEE, MMMM d, yyyy')}
                  <span className="block text-xs mt-0.5 text-primary">
                    {getRelativeTimeString(training.startDate)}
                  </span>
                </p>
              )}
              {training.duration && (
                <p className="mb-1">
                  <span className="font-medium">Duration:</span>{' '}
                  {training.duration}
                </p>
              )}
              {training.location && (
                <p className="mb-1">
                  <span className="font-medium">Location:</span>{' '}
                  {training.location}
                </p>
              )}
            </div>
            <div className="text-xl font-bold mb-2">
              {training.isFree ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>GHS{training.price}</span>
              )}
            </div>
            {training.maxParticipants && (
              <p className="text-sm text-muted-foreground">
                {Math.max(
                  0,
                  training.maxParticipants -
                    (training.registeredParticipants || 0)
                )}{' '}
                spots remaining
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
