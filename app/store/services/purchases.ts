import { createClient } from '@/lib/supabase/browser';
import { CartItem, OrganizationDetails } from '../types/cart';

export async function createPurchaseRecord(
  organizationDetails: OrganizationDetails,
  items: CartItem[],
  total: number,
  payment_reference: string,
  isExistingOrg: boolean
) {
  const supabase = createClient();
  let organization_id: string;

  // Only create organization if it doesn't exist
  if (!isExistingOrg) {
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationDetails.organizationName,
        email: organizationDetails.organizationEmail,
        phone: organizationDetails.phoneNumber,
        status: 'active',
        verificationStatus: 'pending',
        address: {},
      })
      .select()
      .single();

    if (orgError) {
      throw new Error(`Error creating organization: ${orgError.message}`);
    }

    organization_id = org.id;

    // Create billing address
    const { error: addressError } = await supabase
      .from('billing_addresses')
      .insert({
        organization_id,
        street: organizationDetails.address.street,
        city: organizationDetails.address.city,
        state: organizationDetails.address.state,
        country: organizationDetails.address.country,
        postalCode: organizationDetails.address.postalCode,
        isDefault: true,
      });

    if (addressError) {
      throw new Error(
        `Error creating billing address: ${addressError.message}`
      );
    }
  } else {
    // Get organization ID for existing org
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('email', organizationDetails.organizationEmail)
      .single();

    if (orgError) {
      throw new Error(`Error getting organization: ${orgError.message}`);
    }

    organization_id = org.id;

    // Create new billing address if provided and different from existing ones
    const { data: existingAddresses } = await supabase
      .from('billing_addresses')
      .select('*')
      .eq('organization_id', organization_id);

    const addressExists = existingAddresses?.some(
      (addr) =>
        addr.street === organizationDetails.address.street &&
        addr.city === organizationDetails.address.city &&
        addr.state === organizationDetails.address.state &&
        addr.country === organizationDetails.address.country &&
        addr.postalCode === organizationDetails.address.postalCode
    );

    if (!addressExists) {
      const { error: addressError } = await supabase
        .from('billing_addresses')
        .insert({
          organization_id,
          street: organizationDetails.address.street,
          city: organizationDetails.address.city,
          state: organizationDetails.address.state,
          country: organizationDetails.address.country,
          postalCode: organizationDetails.address.postalCode,
          isDefault: false,
        });

      if (addressError) {
        throw new Error(
          `Error creating billing address: ${addressError.message}`
        );
      }
    }
  }

  // Create purchase record
  const { error: purchaseError } = await supabase.from('purchases').insert({
    organization_id,
    payment_reference,
    amount: total,
    status: 'completed',
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      appId: item.product.slug,
    })),
  });

  if (purchaseError) {
    throw new Error(`Error creating purchase record: ${purchaseError.message}`);
  }

  return {
    organization_id,
    payment_reference,
    amount: total,
    status: 'completed',
  };
}
