'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const emailSchema = z.object({
  organizationEmail: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailStepProps {
  defaultEmail?: string;
  isLoadingOrg: boolean;
  onSubmit: (email: string) => void;
}

export function EmailStep({
  defaultEmail = '',
  isLoadingOrg,
  onSubmit,
}: EmailStepProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      organizationEmail: defaultEmail,
    },
  });

  const handleSubmit = (data: EmailFormData) => {
    onSubmit(data.organizationEmail);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Confirm Email</h1>
        <p className="text-muted-foreground">
          Enter your organization/business email to get started.
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="organizationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter organization email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoadingOrg}>
              {isLoadingOrg ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up organization...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
