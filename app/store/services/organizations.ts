import { createClient } from '@/lib/supabase/browser';
import { BillingAddress, Organization } from '@/types/organization';

export interface OrganizationWithBillingAddresses extends Organization {
  billingAddresses: BillingAddress[];
}

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
