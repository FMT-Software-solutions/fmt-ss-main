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
import { createClient } from '@/lib/supabase/browser';
import { PaystackButton } from '@/components/PaystackButton';
import { issuesClient } from '@/services/issues/client';

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [trainingWithLinks, setTrainingWithLinks] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const router = useRouter();
  const imageUrl = getSanityImageUrl(training.mainImage);
  const supabase = createClient();

  // Calculate available spots
  const maxParticipants = training.maxParticipants || 0;
  const registeredParticipants = training.registeredParticipants || 0;
  const availableSpots = Math.max(0, maxParticipants - registeredParticipants);
  const isFull = maxParticipants > 0 && availableSpots === 0;

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
    if (paymentStep || isFull) return; // Prevent submissions when full or already in payment step

    setIsSubmitting(true);
    setRegistrationError(null);

    try {
      // Submit registration to API
      const response = await fetch('/api/training/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          training,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // For free trainings, redirect to thank you page
      if (!data.requiresPayment) {
        toast({
          title: 'Registration successful!',
          description:
            'You have successfully registered for this training program.',
        });
        router.push(`/training/${training.slug.current}/thank-you`);
        return;
      }

      // For paid trainings, show payment form
      setRegistrationData(data.registrationData);
      setTrainingWithLinks(data.trainingWithLinks);
      setPaymentStep(true);
      toast({
        title: 'Please complete payment',
        description:
          'Complete the payment to secure your spot in the training.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Log error to issues service
      await issuesClient.logValidationError(
        'form_submission',
        errorMessage,
        {
          component: 'RegistrationForm',
          training_id: training._id,
          training_slug: training.slug.current,
          form_data: values
        },
        'RegistrationForm'
      );
      
      setRegistrationError(errorMessage);
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePaymentSuccess = async (reference: any) => {
    try {
      setIsProcessingPayment(true);

      // Submit payment to API
      const response = await fetch('/api/training/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: registrationData.id,
          paymentReference: reference.reference,
          amount: training.price,
          trainingData: trainingWithLinks || training,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed');
      }

      toast({
        title: 'Registration complete!',
        description:
          'Your payment has been processed and your registration is confirmed.',
      });

      // Redirect to thank you page
      router.push(`/training/${training.slug.current}/thank-you`);
    } catch (error) {
      console.error('Payment error:', error);
      
      // Log payment error to issues service
      await issuesClient.logPaymentError(
        error instanceof Error ? error.message : 'Payment processing failed',
        {
          component: 'RegistrationForm',
          training_id: training._id,
          training_slug: training.slug.current,
          registration_id: registrationData?.id,
          payment_reference: reference?.reference,
          amount: training.price
        },
        'payment_processing'
      );
      
      toast({
        title: 'Payment failed',
        description:
          'There was an error processing your payment. Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentClose = () => {
    toast({
      title: 'Payment cancelled',
      description:
        'You can complete the payment later to secure your spot in the training.',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        {isFull ? (
          <div className="p-6 border rounded-lg bg-muted">
            <h2 className="text-xl font-bold mb-3">Registration Closed</h2>
            <p className="mb-4">
              This training has reached its maximum capacity of{' '}
              {maxParticipants} participants.
            </p>
            <p className="mb-6 text-muted-foreground">
              Please check back later for future sessions or contact us if you
              would like to be notified when new spots become available.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/training/${training.slug.current}`)}
              className="mr-4"
            >
              Return to Training
            </Button>
            <Button onClick={() => router.push('/training')}>
              Browse Other Trainings
            </Button>
          </div>
        ) : !paymentStep ? (
          <Form {...form}>
            {registrationError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
                {registrationError}
              </div>
            )}
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
                        <Input placeholder="+233 XX XXX XXXX" {...field} />
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
                {isSubmitting ? 'Processing...' : 'Register Now'}
              </Button>
            </form>
          </Form>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
              <p className="mb-6 text-muted-foreground">
                To secure your spot in the training program, please complete the
                payment below.
              </p>

              <PaystackButton
                email={form.getValues('email')}
                amount={training.price}
                metadata={{
                  name: `${form.getValues('firstName')} ${form.getValues('lastName')}`,
                  phone: form.getValues('phone'),
                  custom_fields: [
                    {
                      display_name: 'Training',
                      variable_name: 'training',
                      value: training.title,
                    },
                    {
                      display_name: 'Registration ID',
                      variable_name: 'registration_id',
                      value: registrationData?.id || '',
                    },
                  ],
                }}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                isProcessing={isProcessingPayment}
                isValid={!!registrationData}
              />
            </CardContent>
          </Card>
        )}
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
            {training?.maxParticipants ? (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      isFull ? 'bg-destructive' : 'bg-primary'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (registeredParticipants / maxParticipants) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isFull ? (
                    <span className="text-destructive font-medium">
                      Registration closed
                    </span>
                  ) : (
                    `${availableSpots} ${availableSpots === 1 ? 'spot' : 'spots'} remaining`
                  )}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
