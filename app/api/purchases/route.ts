import { createClient } from '@/lib/supabase/server';
import { generatePassword } from '@/lib/utils';
import { Resend } from 'resend';
import { PurchaseConfirmationEmail } from '@/app/store/emails/PurchaseConfirmation';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { organizationDetails, items, total, payment_reference } =
      await request.json();
    const supabase = await createClient();
    const temporaryPassword = generatePassword();

    // Create organization record
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationDetails.organizationName,
        email: organizationDetails.organizationEmail,
        phone: organizationDetails.phoneNumber,
        address: organizationDetails.address,
      })
      .select()
      .single();

    if (orgError) {
      return NextResponse.json(
        { error: `Error creating organization: ${orgError.message}` },
        { status: 400 }
      );
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        organization_id: organization.id,
        payment_reference: payment_reference,
        amount: total,
        status: 'completed',
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })
      .select()
      .single();

    if (purchaseError) {
      return NextResponse.json(
        { error: `Error creating purchase record: ${purchaseError.message}` },
        { status: 400 }
      );
    }

    // Create user account with temporary password
    const { error: userError } = await supabase.auth.admin.createUser({
      email: organizationDetails.organizationEmail,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (userError) {
      return NextResponse.json(
        { error: `Error creating user account: ${userError.message}` },
        { status: 400 }
      );
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'FMT Software Solutions <noreply@fmtsoftware.com>',
        to: organizationDetails.organizationEmail,
        subject: 'Purchase Confirmation - FMT Software Solutions',
        react: PurchaseConfirmationEmail({
          organizationDetails,
          items,
          total,
          temporaryPassword,
        }),
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't throw error here, as the purchase is already completed
    }

    return NextResponse.json({
      id: purchase.id,
      organization_id: organization.id,
      productId: items[0].productId, // For single product purchases
      purchaseDate: purchase.created_at,
      amount: total,
      status: 'completed',
      temporaryPassword,
      organizationDetails,
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
