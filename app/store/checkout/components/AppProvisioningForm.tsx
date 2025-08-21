'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormData, AppProvisioningDetails } from '../../types/cart';
import { CartItem } from '../../types/cart';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface AppProvisioningFormProps {
  form: UseFormReturn<CheckoutFormData>;
  cartItems: CartItem[];
  isExistingOrg: boolean;
  organizationEmail: string;
}

export function AppProvisioningForm({
  form,
  cartItems,
  isExistingOrg,
  organizationEmail,
}: AppProvisioningFormProps) {
  const [useSameForAll, setUseSameForAll] = useState(false);

  // Filter out items without product data
  const validCartItems = cartItems.filter(item => item.product);



  const handleUseSameForAllChange = (checked: boolean) => {
    setUseSameForAll(checked);
    form.setValue('useSameDetailsForAll', checked);
    
    if (checked && validCartItems.length > 0) {
      // Get the first app's details as the template
      const firstProductId = validCartItems[0].productId;
      const firstAppDetails = form.getValues(`appProvisioningDetails.${firstProductId}`);
      
      if (firstAppDetails) {
        // Apply the same details to all other apps
        validCartItems.slice(1).forEach(item => {
          form.setValue(`appProvisioningDetails.${item.productId}`, firstAppDetails);
        });
      }
    }
  };

  const handleFirstAppDetailsChange = (field: keyof AppProvisioningDetails, value: string | boolean) => {
    if (useSameForAll && validCartItems.length > 0) {
      const firstProductId = validCartItems[0].productId;
      
      // Update the first app
      form.setValue(`appProvisioningDetails.${firstProductId}.${field}`, value);
      
      // Update all other apps with the same value
      validCartItems.slice(1).forEach(item => {
        form.setValue(`appProvisioningDetails.${item.productId}.${field}`, value);
      });
    }
  };

  const renderAppProvisioningFields = (item: CartItem, index: number) => {
    const productId = item.productId;
    const isFirstApp = index === 0;
    const shouldShowFields = !useSameForAll || isFirstApp;
    
    if (!shouldShowFields) {
      return (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Using the same details as configured for {validCartItems[0].product.title}
          </p>
        </div>
      );
    }

    const useSameEmailAsAdmin = form.watch(`appProvisioningDetails.${productId}.useSameEmailAsAdmin`);

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Admin User Account</h4>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`appProvisioningDetails.${productId}.useSameEmailAsAdmin`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (isFirstApp) {
                          handleFirstAppDetailsChange('useSameEmailAsAdmin', checked as boolean);
                        }
                        // Clear userEmail when checkbox is checked
                        if (checked) {
                          form.setValue(`appProvisioningDetails.${productId}.userEmail`, '');
                          if (isFirstApp) {
                            handleFirstAppDetailsChange('userEmail', '');
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Use same organization email as admin email
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      The organization email ({organizationEmail}) will be used as the admin email for this app
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {!useSameEmailAsAdmin && (
              <FormField
                control={form.control}
                name={`appProvisioningDetails.${productId}.userEmail`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter admin email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (isFirstApp) {
                            handleFirstAppDetailsChange('userEmail', e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">App Provisioning Details</h3>
            <p className="text-sm text-muted-foreground">
              Configure organization and admin user details for each app. These will be used to create your accounts.
            </p>
            {isExistingOrg && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Since you have an existing organization, billing will use your existing details.
                  The information below is only for app provisioning and admin account creation.
                </p>
              </div>
            )}
          </div>

          {validCartItems.length > 1 && (
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="useSameForAll"
                checked={useSameForAll}
                onCheckedChange={handleUseSameForAllChange}
              />
              <Label htmlFor="useSameForAll" className="text-sm font-medium">
                Use the same organization and admin details for all apps
              </Label>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {validCartItems.map((item, index) => {
              const isFirstApp = index === 0;
              const defaultOpen = isFirstApp || !useSameForAll;
            
            return (
              <AccordionItem key={item.productId} value={item.productId}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.product.title}</span>
                    {isFirstApp && useSameForAll && (
                      <Badge variant="secondary" className="text-xs">
                        Template for All
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {renderAppProvisioningFields(item, index)}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
            <p><strong>Security Note:</strong> Temporary passwords will be generated automatically and sent to the admin email addresses. 
            Make sure the email addresses are correct and accessible.</p>
          </div>
        </div>
      </Form>
    </Card>
  );
}