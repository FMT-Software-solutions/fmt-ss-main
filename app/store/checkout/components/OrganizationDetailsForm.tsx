'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CartItem } from '../../types/cart';
import { checkDuplicatePurchases } from '../../services/purchases';
import debounce from 'lodash.debounce';

interface OrganizationDetailsFormProps {
  form: UseFormReturn<any>;
  isExistingOrg: boolean;
  fieldPrefix?: string;
  cartItems: CartItem[];
}

export function OrganizationDetailsForm({
  form,
  isExistingOrg,
  fieldPrefix = '',
  cartItems,
}: OrganizationDetailsFormProps) {
  const [useSameForAll, setUseSameForAll] = useState(false);

  // Filter out items without product data
  const validCartItems = cartItems.filter((item) => item.product);

  const getFieldName = (name: string) => {
    return fieldPrefix ? `${fieldPrefix}.${name}` : name;
  };

  // Debounced duplicate validation function
  const validateEmailForDuplicates = useCallback(
    debounce(async (email: string) => {
      if (!email || !validCartItems.length) {
        return;
      }

      try {
        const appIds = validCartItems.map((item) => item.productId);
        const duplicateCheck = await checkDuplicatePurchases(email, appIds);

        if (duplicateCheck.hasDuplicates) {
          const conflictingApps = duplicateCheck.conflictingApps
            .map((app) => app.appName)
            .join(', ');
          const errorMessage = `This email has already purchased this app: ${conflictingApps}`;

          // Set custom validation error on the email field
          form.setError(getFieldName('organizationEmail') as any, {
            type: 'manual',
            message: errorMessage,
          });
        } else {
          // Clear any existing error on the email field
          form.clearErrors(getFieldName('organizationEmail') as any);
        }
      } catch (error) {
        console.error('Error validating duplicates:', error);
      }
    }, 1000),
    [validCartItems, form, getFieldName]
  );

  // Watch for email changes and trigger duplicate validation
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === getFieldName('organizationEmail')) {
        const email =
          value?.billingDetails?.organizationEmail || value?.organizationEmail;
        if (email) {
          validateEmailForDuplicates(email);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      validateEmailForDuplicates.cancel();
    };
  }, [form, validateEmailForDuplicates, getFieldName]);

  const renderField = (label: string, name: string) => {
    const fullFieldName = getFieldName(name);
    return (
      <FormField
        control={form.control}
        name={fullFieldName as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={
                  isExistingOrg &&
                  field.name === 'billingDetails.organizationEmail'
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const handleFirstAppDetailsChange = (
    field: string,
    value: string | boolean | undefined
  ) => {
    if (useSameForAll && validCartItems.length > 0) {
      validCartItems.forEach((item) => {
        if (item.product) {
          form.setValue(
            `appProvisioningDetails.${item.product._id}.${field}`,
            value
          );
        }
      });
    }
  };

  const handleUseSameForAllChange = (checked: boolean) => {
    setUseSameForAll(checked);
    form.setValue('useSameDetailsForAll', checked);

    if (checked && validCartItems.length > 0) {
      const firstAppDetails = form.getValues(
        `appProvisioningDetails.${validCartItems[0].product!._id}`
      );
      validCartItems.slice(1).forEach((item) => {
        if (item.product) {
          form.setValue(
            `appProvisioningDetails.${item.product._id}`,
            firstAppDetails
          );
        }
      });
    }
  };

  const renderAdminUserSection = (productId: string, isFirstApp: boolean) => {
    const useSameEmailAsAdmin = form.watch(
      `appProvisioningDetails.${productId}.useSameEmailAsAdmin`
    );

    return (
      <div className="space-y-4">
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
                        handleFirstAppDetailsChange(
                          'useSameEmailAsAdmin',
                          checked as boolean
                        );
                      }
                      // Clear userEmail when checkbox is checked
                      if (checked) {
                        form.setValue(
                          `appProvisioningDetails.${productId}.userEmail`,
                          undefined
                        );
                        if (isFirstApp) {
                          handleFirstAppDetailsChange('userEmail', undefined);
                        }
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    Use same organization email as admin email
                  </FormLabel>
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
                          handleFirstAppDetailsChange(
                            'userEmail',
                            e.target.value
                          );
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
    );
  };

  return (
    <div className="space-y-6">
      {validCartItems.length > 1 && (
        <Card className="p-4">
          <FormField
            control={form.control}
            name="useSameDetailsForAll"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={handleUseSameForAllChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    Use same details for all apps
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Apply the same provisioning details to all apps in your cart
                  </p>
                </div>
              </FormItem>
            )}
          />
        </Card>
      )}

      <Accordion
        type="multiple"
        defaultValue={validCartItems
          .map((item) => item.product?._id)
          .filter(Boolean)}
        className="space-y-4"
      >
        {validCartItems.map((item, index) => {
          if (!item.product) return null;
          const isFirstApp = index === 0;

          return (
            <AccordionItem key={item.product._id} value={item.product._id}>
              <Card className="p-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">
                        {item.product.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Form {...form}>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium mb-3">
                          Organization/Business Details
                        </h4>
                        <div className="space-y-4">
                          {renderField('Organization Name', 'organizationName')}
                          {renderField('Email', 'organizationEmail')}
                          {renderField('Phone Number', 'phoneNumber')}
                        </div>
                      </div>

                      {renderAdminUserSection(item.product._id, isFirstApp)}
                    </div>
                  </Form>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
