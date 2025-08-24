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
import { checkDuplicatePurchases } from '../../services/purchases';
import { issuesClient } from '@/services/issues/client';
import { CartItem } from '../../types/cart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';

const searchSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface OrganizationSearchProps {
  onOrganizationFound: (hasExistingOrg: boolean, email: string) => void;
  defaultEmail?: string;
  cartItems: CartItem[];
}

export function OrganizationSearch({
  onOrganizationFound,
  defaultEmail = '',
  cartItems,
}: OrganizationSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    email: string;
  } | null>(null);
  const [duplicateValidation, setDuplicateValidation] = useState<{
    hasDuplicates: boolean;
    conflictingApps: Array<{ appId: string; appName?: string }>;
    nonConflictingApps: CartItem[];
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
      setDuplicateValidation(null);

      const org = await getOrganizationForCheckout(data.email);

      const result = {
        found: !!org,
        email: data.email,
      };

      setSearchResult(result);

      // Check for duplicate purchases if organization exists
      if (org && cartItems.length > 0) {
        const appIds = cartItems
          .filter(item => item.product)
          .map(item => item.productId); // Use productId (actual Sanity _id) for more reliable checking

        const duplicateCheck = await checkDuplicatePurchases(data.email, appIds);
        
        if (duplicateCheck.hasDuplicates) {
          // Get app names for conflicting apps
          const conflictingAppsWithNames = duplicateCheck.conflictingApps.map(conflict => {
            const cartItem = cartItems.find(item => item.productId === conflict.appId);
            return {
              ...conflict,
              appName: cartItem?.product?.title || 'Unknown App'
            };
          });

          // Get non-conflicting apps
          const nonConflictingApps = cartItems.filter(item => 
            item.product && !duplicateCheck.duplicateApps.includes(item.productId)
          );

          setDuplicateValidation({
            hasDuplicates: true,
            conflictingApps: conflictingAppsWithNames,
            nonConflictingApps
          });

          toast.error(
            `This organization has already purchased ${conflictingAppsWithNames.length} of the apps in your cart. Please review the conflicts below.`
          );
          return; // Don't proceed with organization found callback
        } else {
          setDuplicateValidation({
            hasDuplicates: false,
            conflictingApps: [],
            nonConflictingApps: cartItems
          });
        }
      }

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
      toast.error('Failed to validate organization. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearValidation = () => {
    setDuplicateValidation(null);
    setSearchResult(null);
  };

  const handleProceedWithNonConflicting = () => {
    if (duplicateValidation && searchResult) {
      onOrganizationFound(searchResult.found, searchResult.email);
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

        {/* Duplicate Purchase Validation Results */}
        {duplicateValidation?.hasDuplicates && (
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-destructive">
                      Duplicate Purchase Detected
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This organization has already purchased the following apps with this email:
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearValidation}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Conflicting Apps:</p>
                  <ul className="text-sm space-y-1">
                    {duplicateValidation.conflictingApps.map((app, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-destructive rounded-full" />
                        {app.appName}
                      </li>
                    ))}
                  </ul>
                </div>

                {duplicateValidation.nonConflictingApps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">
                      Available Apps (no conflicts):
                    </p>
                    <ul className="text-sm space-y-1">
                      {duplicateValidation.nonConflictingApps.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          {item.product?.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {duplicateValidation.nonConflictingApps.length > 0 && (
                    <Button
                      onClick={handleProceedWithNonConflicting}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Proceed with Available Apps
                    </Button>
                  )}
                  <Button
                    onClick={handleClearValidation}
                    variant="outline"
                    size="sm"
                  >
                    Change Email
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Note: Each app requires a unique email for authentication and provisioning.
                  You can either use a different email or proceed with only the non-conflicting apps.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
