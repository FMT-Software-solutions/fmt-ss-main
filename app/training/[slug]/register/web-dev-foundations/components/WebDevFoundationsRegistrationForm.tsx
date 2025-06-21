'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Target,
  Code,
} from 'lucide-react';
import { toast } from 'sonner';
import { ITraining, ICustomRegistrationFormData } from '@/types/training';

const experienceOptions = [
  { id: 'no-programming', label: 'No knowledge about programming' },
  { id: 'little-programming', label: 'Little knowledge about programming' },
  { id: 'no-webdev', label: 'No knowledge about web development' },
  { id: 'little-webdev', label: 'Little knowledge about web development' },
  { id: 'html-basics', label: 'Familiar with HTML basics' },
  { id: 'css-basics', label: 'Familiar with CSS basics' },
  { id: 'javascript-basics', label: 'Familiar with JavaScript basics' },
  {
    id: 'website-builders',
    label: 'Used website builders (WordPress, Wix, etc.)',
  },
  { id: 'self-taught', label: 'Self-taught through online tutorials' },
  { id: 'online-courses', label: 'Completed online coding courses' },
  {
    id: 'academic-background',
    label: 'Academic background in computer science',
  },
  {
    id: 'professional-experience',
    label: 'Professional experience in related fields',
  },
];

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  about: z
    .string()
    .min(10, 'Please tell us a bit about yourself (at least 10 characters)'),
  experience: z
    .array(z.string())
    .min(1, 'Please select at least one option that describes your experience'),
  expectations: z
    .string()
    .min(20, 'Please share your expectations (at least 20 characters)'),
});

interface WebDevFoundationsRegistrationFormProps {
  training: ITraining;
}

export default function WebDevFoundationsRegistrationForm({
  training,
}: WebDevFoundationsRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const form = useForm<ICustomRegistrationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      about: '',
      experience: [],
      expectations: '',
    },
  });

  const onSubmit = async (data: ICustomRegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/training/custom-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainingId: training._id,
          trainingSlug: training.slug.current,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      setIsSubmitted(true);
      toast.success('Registration submitted successfully!');

      // Redirect to thank you page after a delay
      setTimeout(() => {
        router.push(`/training/${training.slug.current}/thank-you`);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-white dark:bg-slate-800 shadow-xl">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Registration Successful!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Thank you for registering for {training.title}. We'll be in touch
            with you soon with more details.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Redirecting you to the confirmation page...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Code className="h-6 w-6 text-blue-600" />
          Registration Form
        </CardTitle>
        <CardDescription>
          Please fill out the form below to register for the Web Development
          Foundations course. This information helps us tailor the course to
          your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
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
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+233 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">About You</h3>
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center gap-2">
                      Tell us about yourself
                      <span className="text-xs text-muted-foreground">
                        {field.value.length}/50 chars
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share a brief introduction about yourself, your background, current role, or what you do..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Help us understand your background and current situation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Code className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Your Experience</h3>
              </div>

              <FormField
                control={form.control}
                name="experience"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Select all that apply to your current knowledge and
                      experience:
                    </FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {experienceOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="experience"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            option.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal leading-5">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expectations Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Your Expectations</h3>
              </div>

              <FormField
                control={form.control}
                name="expectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What are your expectations from this course?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you hope to learn, your goals, what specific skills you want to develop, or any particular projects you have in mind..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your learning goals and what you hope to achieve
                      after completing this course
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By submitting this form, you agree to receive course-related
                communications and updates. Your information will be kept
                confidential and used only for course administration purposes.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
