import { createClient } from '@/lib/supabase/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { registrationId, reason, registrationType = 'regular' } = body;

    if (!registrationId) {
      return Response.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Determine which table to query based on registration type
    const tableName =
      registrationType === 'custom'
        ? 'custom_training_registrations'
        : 'training_registrations';

    // Get the registration details
    const { data: registration, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      console.error('Error fetching registration:', fetchError);
      return Response.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Only decrement count if it's not already cancelled
    const shouldUpdateCount = registration.status !== 'cancelled';

    // Update the registration status to cancelled
    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        status: 'cancelled',
      })
      .eq('id', registrationId);

    if (updateError) {
      console.error('Error updating registration status:', updateError);
      return Response.json(
        { error: 'Failed to update registration status' },
        { status: 500 }
      );
    }

    // Update Sanity document if needed
    if (shouldUpdateCount) {
      try {
        const result = await sanityClient
          .patch(registration.training_id)
          .dec({ registeredParticipants: 1 })
          .commit();
      } catch (sanityError) {
        console.error('Error updating Sanity document:', sanityError);
        // We log the error but don't fail the status update
      }
    }

    // Optionally send a cancellation email to the registrant
    if (registration.email) {
      try {
        await resend.emails.send({
          from: 'training@fmtsoftware.com',
          to: registration.email,
          subject: 'Training Registration Cancelled',
          text: `Dear ${registration.first_name},\n\nYour registration for the training has been cancelled.\n${reason ? `Reason: ${reason}` : ''}\n\nIf you have any questions, please contact us.\n\nRegards,\nFMT Software Solutions Team`,
        });
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
        // We don't fail the cancellation if just the email fails
      }
    }

    return Response.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
