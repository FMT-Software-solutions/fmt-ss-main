'use client';

import { PaystackButton } from '@/components/PaystackButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { issuesClient } from '@/services/issues/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ITraining } from '@/types/training';
import { zodResolver } from '@hookform/resolvers/zod';
import { tr } from 'date-fns/locale';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Code,
  Copy,
  CreditCard,
  FileText,
  ImageIcon,
  Info,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
  Target,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const sessionOptions = [
  {
    id: 'morning',
    label: 'Morning Session',
    time: '9:00 AM - 11:00 AM',
    description: 'For those with evening commitments',
  },
  {
    id: 'evening',
    label: 'Evening Session',
    time: '7:00 PM - 9:00 PM',
    description: 'Ideal for those with morning commitments',
  },
];

const experienceOptions = [
  'No knowledge about programming',
  'Little knowledge about programming',
  'No knowledge about web development',
  'Little knowledge about web development',
  'Familiar with HTML and CSS basics',
  'Familiar with JavaScript basics',
  'No knowledge about React.js',
  'Familiar with React.js basics',
  'Familiar with Git and version control',
  'Self-taught through online tutorials',
  'Completed online coding courses',
  'Academic background in computer science',
  'Professional experience in related fields',
];

interface IBootcampRegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  session: string;
  about: string;
  experience: string[];
  expectations: string;
  momoAccountName?: string;
}

type PaymentMethod = 'paystack' | 'momo';
type FormStep = 'form' | 'payment';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  session: z.string().min(1, 'Please select a session time'),
  about: z
    .string()
    .min(10, 'Please tell us a bit about yourself (at least 10 characters)'),
  experience: z
    .array(z.string())
    .min(1, 'Please select at least one option that describes your experience'),
  expectations: z
    .string()
    .min(20, 'Please share your expectations (at least 20 characters)'),
  momoAccountName: z.string().optional(),
});

interface WebDevBootcampRegistrationFormProps {
  training: ITraining;
}

export default function WebDevBootcampRegistrationForm({
  training,
}: WebDevBootcampRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod
  >('paystack');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [
    formData,
    setFormData,
  ] = useState<IBootcampRegistrationFormData | null>(null);
  const router = useRouter();

  const form = useForm<IBootcampRegistrationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      session: '',
      about: '',
      experience: [],
      expectations: '',
      momoAccountName: '',
    },
  });

  const handleFormSubmit = async (data: IBootcampRegistrationFormData) => {
    if (training.isFree) {
      // For free trainings, submit directly
      await submitRegistration(data);
    } else {
      // For paid trainings, move to payment step
      setFormData(data);
      setCurrentStep('payment');
    }
  };

  const submitRegistration = async (
    data: IBootcampRegistrationFormData,
    paymentReference?: any
  ) => {
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
          paymentReference,
          paymentMethod: selectedPaymentMethod,
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
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      // Log error to issues service
      await issuesClient.logValidationError(
        'form_submission',
        errorMessage,
        {
          component: 'WebDevBootcampRegistrationForm',
          training_id: training._id,
          training_slug: training.slug.current,
          form_data: data,
          payment_method: selectedPaymentMethod
        },
        'WebDevBootcampRegistrationForm'
      );
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const handlePaystackSuccess = async (reference: any) => {
    if (formData && reference && reference.status === 'success') {
      await submitRegistration(formData, reference);
    } else {
      toast.error('Payment verification failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handlePaystackClose = () => {
    setIsProcessingPayment(false);
    toast.error('Payment was cancelled.');
  };

  const handleMoMoPayment = async () => {
    if (!formData) return;

    if (selectedPaymentMethod === 'momo' && !formData.momoAccountName?.trim()) {
      toast.error('Please enter the MoMo account name used for payment.');
      return;
    }

    setIsProcessingPayment(true);
    // Simulate processing time for manual payment
    setTimeout(async () => {
      const reference = {
        reference: `MOMO_PENDING_${Date.now()}`,
        status: 'pending',
        method: 'manual_momo',
        momoAccountName: formData.momoAccountName,
      };
      await submitRegistration(formData, reference);
    }, 2000);
  };

  const openWhatsApp = () => {
    if (!formData) return;
    const phoneNumber = '233559617959';
    const message = encodeURIComponent(
      `Hello! I just made a mobile money payment for the ${
        training.title
      } training. Reference: Bootcamp. Please confirm my payment. My details: ${
        formData.firstName
      } ${formData.lastName}, ${formData.email}. MoMo Account Name: ${
        formData.momoAccountName || 'Same as participant name'
      }`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
            with you soon with more details about your selected session.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Redirecting you to the confirmation page...
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderFormStep = () => (
    <Card className="bg-white dark:bg-slate-800 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Code className="h-6 w-6 text-pink-600" />
          Registration Form
        </CardTitle>
        <CardDescription>
          Please fill out the form below to register for the Web Development
          Bootcamp. Choose your preferred session time and tell us about your
          background to help us tailor the experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Session Selection Section - Early in the form */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Select Your Session</h3>
              </div>

              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose your preferred session time</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {sessionOptions.map((session) => (
                          <div key={session.id} className="relative">
                            <RadioGroupItem
                              value={session.id}
                              id={session.id}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={session.id}
                              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                field.value === session.id
                                  ? 'border-pink-500 bg-pink-50/50 shadow-md dark:border-pink-500 dark:bg-pink-900/20 dark:ring-pink-800'
                                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25 dark:border-gray-700 dark:hover:border-pink-400 dark:hover:bg-pink-900/10'
                              }`}
                            >
                              {/* Visible Checkbox */}
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                                  field.value === session.id
                                    ? 'bg-pink-600 border-pink-600 text-white'
                                    : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                                }`}
                              >
                                {field.value === session.id && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </div>

                              {/* Session Content */}
                              <div className="flex-1">
                                <div
                                  className={`font-semibold transition-colors ${
                                    field.value === session.id
                                      ? 'text-pink-900 dark:text-pink-100'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {session.label}
                                </div>
                                <div
                                  className={`text-sm font-medium transition-colors ${
                                    field.value === session.id
                                      ? 'text-pink-700 dark:text-pink-300'
                                      : 'text-pink-600 dark:text-pink-400'
                                  }`}
                                >
                                  {session.time}
                                </div>
                                <div
                                  className={`text-xs mt-1 transition-colors ${
                                    field.value === session.id
                                      ? 'text-pink-700 dark:text-pink-300'
                                      : 'text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {session.description}
                                </div>
                              </div>

                              {/* Selected Indicator */}
                              {field.value === session.id && (
                                <div className="flex-shrink-0">
                                  <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                                </div>
                              )}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-5 w-5 text-pink-600" />
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
                          placeholder="Enter your email address"
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
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                        />
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
                <FileText className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold">
                  Tell Us About Yourself
                </h3>
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About You</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your background, current role, or what brings you to web development..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share a bit about yourself, your current situation, and
                      what motivates you to learn web development.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Target className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Your Experience</h3>
              </div>

              <FormField
                control={form.control}
                name="experience"
                render={() => (
                  <FormItem>
                    <FormLabel>Current Knowledge & Experience</FormLabel>
                    <FormDescription>
                      Select all that apply to your current knowledge and
                      experience level. This helps us understand where you're
                      starting from.
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {experienceOptions.map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="experience"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            option,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal leading-5">
                                  {option}
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
                <Target className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Your Goals</h3>
              </div>

              <FormField
                control={form.control}
                name="expectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you hope to achieve?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your goals, what you hope to learn, career aspirations, or specific skills you want to develop..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us about your goals and expectations for this
                      bootcamp. What do you hope to achieve by the end of the
                      program?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : training.isFree ? (
                  'Complete Registration'
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {training.isFree
                  ? "After submitting your registration, you'll receive a confirmation email with further details about your selected session and next steps for the bootcamp."
                  : "After filling out the form, you'll proceed to the payment step to complete your registration."}
              </AlertDescription>
            </Alert>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card className="bg-white dark:bg-slate-800 shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('form')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-pink-600" />
            Payment
          </CardTitle>
        </div>
        <CardDescription>
          Complete your registration by making a payment for {training.title}.
          <br />
          Total amount:{' '}
          <span className="text-primary font-bold">
            GH₵{training.price?.toFixed(2)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-pink-600" />
            Choose Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paystack Option */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === 'paystack'
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/20'
                  : 'border-gray-200 hover:border-pink-300 dark:border-gray-700'
              }`}
              onClick={() => setSelectedPaymentMethod('paystack')}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedPaymentMethod === 'paystack'
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedPaymentMethod === 'paystack' && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card Payment
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pay with Visa, Mastercard, or Mobile Money
                  </p>
                </div>
              </div>
            </div>

            {/* MoMo Option */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === 'momo'
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/20'
                  : 'border-gray-200 hover:border-pink-300 dark:border-gray-700'
              }`}
              onClick={() => setSelectedPaymentMethod('momo')}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedPaymentMethod === 'momo'
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedPaymentMethod === 'momo' && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Manual MoMo Transfer
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transfer directly to our MoMo account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        {selectedPaymentMethod === 'paystack' && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You will be redirected to a secure payment page to complete your
                transaction.
              </AlertDescription>
            </Alert>
            {formData && (
              <PaystackButton
                email={formData.email}
                amount={training.price}
                metadata={{
                  name: `${formData.firstName} ${formData.lastName}`,
                  phone: formData.phone,
                  custom_fields: [
                    {
                      display_name: 'Training ID',
                      variable_name: 'training_id',
                      value: training._id,
                    },
                    {
                      display_name: 'Training Title',
                      variable_name: 'training_title',
                      value: training.title,
                    },
                    {
                      display_name: 'Participant Name',
                      variable_name: 'participant_name',
                      value: `${formData.firstName} ${formData.lastName}`,
                    },
                    {
                      display_name: 'Session',
                      variable_name: 'session',
                      value: formData.session,
                    },
                  ],
                }}
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                isProcessing={isProcessingPayment}
                isValid={true}
              />
            )}
          </div>
        )}

        {selectedPaymentMethod === 'momo' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Make payment to the MoMo Account details below and we will confirm
              your registration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MoMo Details Flyer */}
              <div className="rounded-lg overflow-hidden mb-4 max-w-[300px] border">
                <img
                  src="/fmt-momo.jpg"
                  alt="MoMo Payment Details"
                  className="w-full h-auto"
                />
              </div>

              {/* MoMo Payment Details */}
              <div className="space-y-3">
                <p className="text-md font-bold text-gray-700 dark:text-gray-300 px-3">
                  Amount to Pay:{' '}
                  <span className="text-primary">
                    GHS{training.price?.toFixed(2)}
                  </span>
                </p>
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Momo Number
                    </p>
                    <p className="text-lg font-mono font-semibold">
                      0530516908
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('0530516908');
                      toast.success('Momo number copied');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reference
                    </p>
                    <p className="text-lg font-semibold">Bootcamp</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('Bootcamp');
                      toast.success('Reference copied');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* MoMo Account Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                MoMo Account Name Used for Payment
              </label>
              <Input
                placeholder="Enter the name on the MoMo account used for payment"
                value={formData?.momoAccountName || ''}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, momoAccountName: e.target.value } : prev
                  )
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This helps us verify your payment if you used a different
                account name
              </p>
            </div>

            {/* MoMo Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                After making the transfer, click "I've Made Payment" below and
                we'll verify your transaction.
              </AlertDescription>
            </Alert>

            {/* MoMo Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleMoMoPayment}
                disabled={
                  isProcessingPayment || !formData?.momoAccountName?.trim()
                }
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "I've Made Payment"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={openWhatsApp}
                className="flex-1"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {currentStep === 'form' ? renderFormStep() : renderPaymentStep()}
    </div>
  );
}
