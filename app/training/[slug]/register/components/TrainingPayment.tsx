'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Info,
  MessageCircle,
} from 'lucide-react';
import { PaystackButton } from '@/components/PaystackButton';
import { ITraining } from '@/types/training';

interface TrainingPaymentProps {
  training: ITraining;
  participantEmail: string;
  participantName: string;
  onPaymentSuccess: (reference?: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
}

type PaymentMethod = 'paystack' | 'momo';

export default function TrainingPayment({
  training,
  participantEmail,
  participantName,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false,
}: TrainingPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    'paystack'
  );
  const [isConfirming, setIsConfirming] = useState(false);

  const fullName = participantName;
  const amount = training.price || 0;

  const handleMoMoPayment = () => {
    setIsConfirming(true);
    // Simulate processing time for manual payment
    setTimeout(() => {
      setIsConfirming(false);
      // For manual payment, we pass a special reference indicating pending status
      onPaymentSuccess({
        reference: `MOMO_PENDING_${Date.now()}`,
        status: 'pending',
        method: 'manual_momo',
      });
    }, 2000);
  };

  const openWhatsApp = () => {
    const phoneNumber = '233559617959';
    const message = encodeURIComponent(
      `Hello! I just made a mobile money payment for the ${training.title} training. Reference: Bootcamp. Please confirm my payment. My details: ${fullName}, ${participantEmail}`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment for {training.title}
          </CardTitle>
          <CardDescription>
            Complete your registration by making payment of GHS{' '}
            {amount.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Choose Payment Method</h3>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) =>
                setSelectedMethod(value as PaymentMethod)
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Paystack Online Payment */}
              <div className="relative">
                <RadioGroupItem
                  value="paystack"
                  id="paystack"
                  className="peer sr-only"
                />
                <label
                  htmlFor="paystack"
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedMethod === 'paystack'
                      ? 'border-pink-600 bg-pink-50 shadow-md ring-2 ring-pink-200 dark:border-pink-500 dark:bg-pink-900/20 dark:ring-pink-800'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25 dark:border-gray-700 dark:hover:border-pink-400 dark:hover:bg-pink-900/10'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                      selectedMethod === 'paystack'
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    {selectedMethod === 'paystack' && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold">Online Payment</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pay instantly with card or mobile money
                    </p>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Instant confirmation
                    </div>
                  </div>
                </label>
              </div>

              {/* Manual MoMo Payment */}
              <div className="relative">
                <RadioGroupItem
                  value="momo"
                  id="momo"
                  className="peer sr-only"
                />
                <label
                  htmlFor="momo"
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedMethod === 'momo'
                      ? 'border-pink-600 bg-pink-50 shadow-md ring-2 ring-pink-200 dark:border-pink-500 dark:bg-pink-900/20 dark:ring-pink-800'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25 dark:border-gray-700 dark:hover:border-pink-400 dark:hover:bg-pink-900/10'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                      selectedMethod === 'momo'
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    {selectedMethod === 'momo' && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="font-semibold">Manual MoMo Payment</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pay directly to our mobile money account
                    </p>
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      ⏳ Manual confirmation required
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Method Details */}
          {selectedMethod === 'paystack' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to Paystack to complete your payment
                  securely. Both card and mobile money payments are supported.
                </AlertDescription>
              </Alert>

              <PaystackButton
                email={participantEmail}
                amount={amount}
                metadata={{
                  name: fullName,
                  phone: participantEmail, // Using email as phone placeholder
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
                      display_name: 'Participant',
                      variable_name: 'participant',
                      value: fullName,
                    },
                    {
                      display_name: 'Participant Email',
                      variable_name: 'participant_email',
                      value: participantEmail,
                    },
                  ],
                }}
                onSuccess={onPaymentSuccess}
                onClose={() => onPaymentError('Payment was cancelled')}
                isProcessing={isProcessing}
                isValid={true}
              />
            </div>
          )}

          {selectedMethod === 'momo' && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Many users have reported issues with online payments. Use this
                  manual option if you're experiencing payment difficulties.
                </AlertDescription>
              </Alert>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobile Money Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Network:</span>
                      <p className="text-blue-700 dark:text-blue-300">
                        MTN Mobile Money
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Number:</span>
                      <p className="text-blue-700 dark:text-blue-300 font-mono">
                        0XX XXX XXXX
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-blue-700 dark:text-blue-300">
                        FMT Software Solutions
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Reference:</span>
                      <p className="text-blue-700 dark:text-blue-300 font-mono">
                        Bootcamp
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Please use "Bootcamp" as your
                      reference when making the payment. This helps us identify
                      your transaction quickly.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  onClick={handleMoMoPayment}
                  className="w-full"
                  size="lg"
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
                      Confirming Payment...
                    </>
                  ) : (
                    `Confirm MoMo Payment - GHS ${amount.toFixed(2)}`
                  )}
                </Button>

                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact us on WhatsApp
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>

              <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertDescription>
                  After making payment, click "Confirm MoMo Payment" above, then
                  contact us on WhatsApp (+233559617959) to verify your payment.
                  We'll confirm and send your registration details within 24
                  hours.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
