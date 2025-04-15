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
import { OrganizationDetails } from '../../types/cart';

interface OrganizationDetailsFormProps {
  form: UseFormReturn<OrganizationDetails>;
  isExistingOrg: boolean;
  billingAddresses: BillingAddress[];
}

export function OrganizationDetailsForm({
  form,
  isExistingOrg,
  billingAddresses,
}: OrganizationDetailsFormProps) {
  const renderField = (label: string, name: keyof OrganizationDetails) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input {...field} disabled={isExistingOrg} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form className="space-y-4">
          <div className="space-y-4">
            {renderField('Organization Name', 'organizationName')}
            {renderField('Email', 'organizationEmail')}
            {renderField('Phone Number', 'phoneNumber')}
          </div>

          <div className="space-y-4 bg-gray-100 dark:bg-black rounded-sm p-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Billing Address Details</h3>
              {isExistingOrg && billingAddresses.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Using default billing address
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="address.street"
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
                name="address.city"
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
                name="address.state"
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
                name="address.country"
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
                name="address.postalCode"
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
          </div>
        </form>
      </Form>
    </Card>
  );
}
