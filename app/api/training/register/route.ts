import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import TrainingRegistrationEmail from '@/emails/TrainingRegistrationEmail';
import { client } from '@/sanity/lib/client';
import { trainingBySlugWithLinksQuery } from '@/sanity/lib/queries';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { firstName, lastName, email, phone, company, message, training } =
      body;

    // Validate input
    if (!firstName || !lastName || !email || !phone || !training) {
      return Response.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if we've reached maximum participants
    if (
      training.maxParticipants &&
      training.registeredParticipants >= training.maxParticipants
    ) {
      return Response.json(
        { error: 'Registration is closed. Maximum participants reached.' },
        { status: 400 }
      );
    }

    // Fetch training data with event links for email purposes
    let trainingWithLinks;
    try {
      trainingWithLinks = await client.fetch(trainingBySlugWithLinksQuery, {
        slug: training.slug.current,
      });
    } catch (error) {
      console.error('Error fetching training with links:', error);
      // Use the provided training data as fallback
      trainingWithLinks = training;
    }

    // For paid trainings, just create a temporary registration record
    if (!training.isFree) {
      const { data, error: dbError } = await supabase
        .from('training_registrations')
        .insert({
          training_id: training._id,
          training_slug: training.slug.current,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company: company || null,
          message: message || null,
          status: 'pending', // Status will be updated after payment
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving registration to database:', dbError);
        return Response.json(
          { error: 'Failed to save registration' },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        requiresPayment: true,
        registrationId: data.id,
        amount: training.price,
        registrationData: data,
        trainingWithLinks, // Include training data with links for payment API
      });
    }

    // For free trainings, proceed with full registration process
    const { data, error: dbError } = await supabase
      .from('training_registrations')
      .insert({
        training_id: training._id,
        training_slug: training.slug.current,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company: company || null,
        message: message || null,
        status: 'confirmed', // Auto-confirm free trainings
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving registration to database:', dbError);
      return Response.json(
        { error: 'Failed to save registration' },
        { status: 500 }
      );
    }

    // Send confirmation email for free trainings using training data with links
    const { error: emailError } = await resend.emails.send({
      from: 'training@fmtsoftware.com',
      to: email,
      subject: `Registration Confirmation: ${trainingWithLinks.title}`,
      react: TrainingRegistrationEmail({
        firstName,
        training: trainingWithLinks,
      }),
    });

    if (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // We don't want to fail the registration if just the email fails
    }

    // Update participant count for free trainings
    try {
      const result = await client
        .patch(training._id)
        .inc({ registeredParticipants: 1 })
        .commit();
    } catch (sanityError) {
      console.error('Error updating Sanity document:', sanityError);
      // Try to set the field if it doesn't exist
      try {
        await client
          .patch(training._id)
          .set({ registeredParticipants: 1 })
          .commit();
      } catch (initError) {
        console.error('Error initializing participant count:', initError);
      }
    }

    return Response.json({
      success: true,
      requiresPayment: false,
      registrationId: data.id,
      registrationData: data,
    });
  } catch (error) {
    console.error('Error processing registration:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
