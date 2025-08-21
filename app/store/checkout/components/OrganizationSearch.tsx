'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getOrganizationForCheckout } from '../../services/organizations';
import { issuesClient } from '@/services/issues/client';

const searchSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface OrganizationSearchProps {
  onOrganizationFound: (hasExistingOrg: boolean, email: string) => void;
  defaultEmail?: string;
}

export function OrganizationSearch({
  onOrganizationFound,
  defaultEmail = '',
}: OrganizationSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    email: string;
  } | null>(null);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const handleSearch = async (data: SearchFormData) => {
    try {
      setIsSearching(true);
      setSearchResult(null);

      const org = await getOrganizationForCheckout(data.email);

      const result = {
        found: !!org,
        email: data.email,
      };

      setSearchResult(result);

      if (org) {
        toast.success(
          "We found existing details for this email! We'll use your existing details for billing."
        );
      }

      onOrganizationFound(!!org, data.email);
    } catch (error) {
      // Log organization search error
      await issuesClient.logCheckoutError(
        error instanceof Error ? error : 'Failed to check organization existence',
        'OrganizationSearch',
        `Searching for organization with email: ${data.email}`,
        { email: data.email, error: error instanceof Error ? error.message : String(error) }
      );
      console.error(
        'There was an error encountered during email lookup.',
        error
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization/Business Email</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                      <Button
                        type="submit"
                        disabled={isSearching || !form.formState.isValid}
                        className="shrink-0 min-w-40"
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </Card>
  );
}
