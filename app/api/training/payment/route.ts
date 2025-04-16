import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import TrainingPaymentConfirmationEmail from '@/emails/TrainingPaymentConfirmationEmail';
import TrainingRegistrationEmail from '@/emails/TrainingRegistrationEmail';
import { client } from '@/sanity/lib/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { registrationId, paymentReference, amount, trainingData } = body;

    if (!registrationId || !paymentReference) {
      return Response.json(
        { error: 'Registration ID and payment reference are required' },
        { status: 400 }
      );
    }

    // Get the registration details
    const { data: registration, error: fetchError } = await supabase
      .from('training_registrations')
      .select('*, training_slug')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      console.error('Error fetching registration:', fetchError);
      return Response.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Update the registration status to confirmed
    const { error: updateError } = await supabase
      .from('training_registrations')
      .update({
        status: 'confirmed',
      })
      .eq('id', registrationId);

    if (updateError) {
      console.error('Error updating registration status:', updateError);
      return Response.json(
        { error: 'Failed to update registration status' },
        { status: 500 }
      );
    }

    // Increment participant count in Sanity
    try {
      await client
        .patch(registration.training_id)
        .inc({ registeredParticipants: 1 })
        .commit();
    } catch (sanityError) {
      console.error('Error updating Sanity document:', sanityError);
      // We log the error but don't fail the payment process
    }

    // Send registration confirmation email first
    try {
      await resend.emails.send({
        from: 'training@fmtsoftware.com',
        to: registration.email,
        subject: `Registration Confirmation: ${trainingData?.title || 'Training Program'}`,
        react: TrainingRegistrationEmail({
          firstName: registration.first_name,
          training: trainingData || { title: 'Training Program' },
          registrationData: registration,
        }),
      });
    } catch (emailError) {
      console.error(
        'Error sending registration confirmation email:',
        emailError
      );
      // We don't want to fail if email sending fails
    }

    // Send payment confirmation email
    try {
      await resend.emails.send({
        from: 'training@fmtsoftware.com',
        to: registration.email,
        subject: 'Payment Confirmation for Training Registration',
        react: TrainingPaymentConfirmationEmail({
          firstName: registration.first_name,
          paymentReference,
          amount,
          registrationData: registration,
        }),
      });
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
      // We don't want to fail the payment confirmation if just the email fails
    }

    return Response.json({
      success: true,
      message: 'Payment recorded successfully',
      registration,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
