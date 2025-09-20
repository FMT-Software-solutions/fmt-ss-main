import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import TrainingPaymentConfirmationEmail from '@/emails/TrainingPaymentConfirmationEmail';
import TrainingRegistrationEmail from '@/emails/TrainingRegistrationEmail';
import { client } from '@/sanity/lib/client';
import { issuesServer } from '@/services/issues/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  let body: any;
  try {
    const supabase = await createClient();
    body = await request.json();
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
      
      await issuesServer.logDatabaseError(
        fetchError?.message || 'Registration not found',
        'fetch_registration',
        'training_registrations',
        undefined,
        {
          component: 'training-payment-api',
          registration_id: registrationId,
          payment_reference: paymentReference
        }
      );
      
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
      
      await issuesServer.logDatabaseError(
        updateError.message || 'Failed to update registration status',
        'update_registration_status',
        'training_registrations',
        undefined,
        {
          component: 'training-payment-api',
          registration_id: registrationId,
          payment_reference: paymentReference,
          user_email: registration.email
        }
      );
      
      return Response.json(
        { error: 'Failed to update registration status' },
        { status: 500 }
      );
    }

    // Increment participant count in Sanity
    try {
      const result = await client
        .patch(registration.training_id)
        .inc({ registeredParticipants: 1 })
        .commit();
    } catch (sanityError) {
      console.error('Error updating Sanity document:', sanityError);
      // Try to set the field if it doesn't exist
      try {
        await client
          .patch(registration.training_id)
          .set({ registeredParticipants: 1 })
          .commit();
      } catch (initError) {
        console.error('Error initializing participant count:', initError);
      }
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
        }),
      });
    } catch (emailError) {
      console.error(
        'Error sending registration confirmation email:',
        emailError
      );
      
      await issuesServer.logEmailError(
        emailError instanceof Error ? emailError.message : 'Failed to send registration confirmation email',
        'registration_confirmation',
        registration.email,
        undefined,
        undefined,
        {
          component: 'training-payment-api',
          registration_id: registrationId,
          payment_reference: paymentReference,
          training_title: trainingData?.title
        }
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
      
      await issuesServer.logEmailError(
        emailError instanceof Error ? emailError.message : 'Failed to send payment confirmation email',
        'payment_confirmation',
        registration.email,
        undefined,
        undefined,
        {
          component: 'training-payment-api',
          registration_id: registrationId,
          payment_reference: paymentReference,
          training_title: trainingData?.title
        }
      );
      
      // We don't want to fail the payment confirmation if just the email fails
    }

    return Response.json({
      success: true,
      message: 'Payment recorded successfully',
      registration,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    
    await issuesServer.logApiError(
      error instanceof Error ? error.message : 'Unknown error processing payment',
      '/api/training/payment',
      'POST',
      body,
      undefined,
      500
    );
    
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
