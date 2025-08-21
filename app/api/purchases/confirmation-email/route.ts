import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { PurchaseConfirmationEmail } from '@/app/store/emails/PurchaseConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { organizationDetails, items, total } = await request.json();

    // Send confirmation email with purchase details
    try {
      await resend.emails.send({
        from: 'FMT Software Solutions <purchase@fmtsoftware.com>',
        to: organizationDetails.organizationEmail,
        subject: 'Purchase Confirmation - FMT Software Solutions',
        react: PurchaseConfirmationEmail({
          organizationDetails,
          items,
          total,
        }),
      });

      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully',
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send confirmation email',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing purchase confirmation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
