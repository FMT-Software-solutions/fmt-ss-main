'use client';

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
import { BillingAddress } from '@/types/organization';
import { UseFormReturn } from 'react-hook-form';

interface BillingAddressFormProps {
  form: UseFormReturn<any>;
  isExistingOrg: boolean;
  billingAddresses: Pick<
    BillingAddress,
    'id' | 'street' | 'city' | 'state' | 'country' | 'postalCode' | 'isDefault'
  >[];
  fieldPrefix?: string;
}

export function BillingAddressForm({
  form,
  isExistingOrg,
  billingAddresses,
  fieldPrefix = '',
}: BillingAddressFormProps) {
  const getFieldName = (name: string) => {
    return fieldPrefix ? `${fieldPrefix}.${name}` : name;
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Billing Address</h3>
            {isExistingOrg && billingAddresses.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Using default billing address
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name={getFieldName('address.street') as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={getFieldName('address.city') as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={getFieldName('address.state') as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state/region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={getFieldName('address.country') as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={getFieldName('address.postalCode') as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Card>
  );
}
