import { createClient } from '@/lib/supabase/browser';
import { BillingAddress, Organization } from '@/types/organization';

export interface OrganizationWithBillingAddresses extends Organization {
  billingAddresses: BillingAddress[];
}

// Secure interface that only exposes necessary data for checkout
export interface SecureOrganizationLookup {
  id: string;
  name: string;
  email: string;
  phone?: string;
  billingAddresses: Pick<BillingAddress, 'id' | 'street' | 'city' | 'state' | 'country' | 'postalCode' | 'isDefault'>[];
}

// Original function for internal use (admin, etc.)
export async function getOrganizationByEmail(
  email: string
): Promise<OrganizationWithBillingAddresses | null> {
  const supabase = createClient();

  // First get the organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('email', email)
    .single();

  if (orgError) {
    if (orgError.code === 'PGRST116') {
      // No organization found
      return null;
    }
    throw orgError;
  }

  // Then get the billing addresses
  const { data: billingAddresses, error: addressError } = await supabase
    .from('billing_addresses')
    .select('*')
    .eq('organization_id', org.id)
    .order('isDefault', { ascending: false });

  if (addressError) {
    throw addressError;
  }

  return {
    ...org,
    billingAddresses: billingAddresses || [],
  };
}

// Secure function for checkout that only returns necessary data
export async function getOrganizationForCheckout(
  email: string
): Promise<SecureOrganizationLookup | null> {
  const supabase = createClient();

  // Only select necessary fields for checkout
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, email, phone')
    .eq('email', email)
    .eq('status', 'active') // Only return active organizations
    .single();

  if (orgError) {
    if (orgError.code === 'PGRST116') {
      // No organization found
      return null;
    }
    throw orgError;
  }

  // Get only necessary billing address fields
  const { data: billingAddresses, error: addressError } = await supabase
    .from('billing_addresses')
    .select('id, street, city, state, country, postalCode, isDefault')
    .eq('organization_id', org.id)
    .order('isDefault', { ascending: false });

  if (addressError) {
    throw addressError;
  }

  return {
    id: org.id,
    name: org.name,
    email: org.email,
    phone: org.phone,
    billingAddresses: billingAddresses || [],
  };
}
