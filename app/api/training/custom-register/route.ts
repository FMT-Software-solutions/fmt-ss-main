import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ICustomRegistrationFormData } from '@/types/training';
import { z } from 'zod';
import { Resend } from 'resend';
import { client as sanityClient } from '@/sanity/lib/client';
import { trainingBySlugWithLinksQuery } from '@/sanity/lib/queries';
import { CustomTrainingRegistrationEmail } from '@/emails/CustomTrainingRegistrationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
  trainingId: z.string().min(1, 'Training ID is required'),
  trainingSlug: z.string().min(1, 'Training slug is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  about: z.string().min(10, 'Please tell us a bit about yourself'),
  experience: z
    .array(z.string())
    .min(1, 'Please select at least one experience option'),
  expectations: z.string().min(20, 'Please share your expectations'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = registerSchema.parse(body);

    // Create Supabase client
    const supabase = await createClient();

    // Check if email already exists for this training
    const { data: existingRegistration, error: checkError } = await supabase
      .from('custom_training_registrations')
      .select('id')
      .eq('email', validatedData.email)
      .eq('training_slug', validatedData.trainingSlug)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing registration:', checkError);
      return NextResponse.json(
        { message: 'Error checking registration status' },
        { status: 500 }
      );
    }

    if (existingRegistration) {
      return NextResponse.json(
        {
          message:
            'You have already registered for this training with this email address',
        },
        { status: 400 }
      );
    }

    // Fetch training details from Sanity
    let trainingData;
    try {
      trainingData = await sanityClient.fetch(trainingBySlugWithLinksQuery, {
        slug: validatedData.trainingSlug,
      });

      if (!trainingData) {
        throw new Error('Training not found');
      }
    } catch (sanityError) {
      console.error('Error fetching training from Sanity:', sanityError);
      return NextResponse.json(
        { message: 'Training not found' },
        { status: 404 }
      );
    }

    // Prepare the registration data
    const registrationData = {
      training_id: validatedData.trainingId,
      training_slug: validatedData.trainingSlug,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      status: 'confirmed' as const,
      details: {
        about: validatedData.about,
        experience: validatedData.experience,
        expectations: validatedData.expectations,
      },
    };

    // Insert the registration
    const { data, error } = await supabase
      .from('custom_training_registrations')
      .insert([registrationData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting registration:', error);
      return NextResponse.json(
        { message: 'Failed to save registration. Please try again.' },
        { status: 500 }
      );
    }

    // Update participant count in Sanity
    try {
      const result = await sanityClient
        .patch(validatedData.trainingId)
        .inc({ registeredParticipants: 1 })
        .commit();
    } catch (sanityError) {
      console.error('Error updating participant count in Sanity:', sanityError);
      // Try to set the field if it doesn't exist
      try {
        await sanityClient
          .patch(validatedData.trainingId)
          .set({ registeredParticipants: 1 })
          .commit();
      } catch (initError) {
        console.error('Error initializing participant count:', initError);
      }
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'FMT Software Solutions <training@fmtsoftware.com>',
        to: [validatedData.email],
        subject: `Registration Confirmed: ${trainingData.title}`,
        react: CustomTrainingRegistrationEmail({
          firstName: validatedData.firstName,
          training: trainingData,
          registrationDetails: {
            about: validatedData.about,
            experience: validatedData.experience,
            expectations: validatedData.expectations,
          },
        }),
      });

    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the registration if email fails
    }

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'FMT Software Solutions <notifications@fmtsoftware.com>',
        to: ['training@fmtsoftware.com'],
        subject: `New Custom Registration: ${trainingData.title}`,
        html: `
          <h2>New Training Registration</h2>
          <p><strong>Training:</strong> ${trainingData.title}</p>
          <p><strong>Participant:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Registration ID:</strong> ${data.id}</p>
          <hr>
          <h3>About:</h3>
          <p>${validatedData.about}</p>
          <h3>Experience:</h3>
          <ul>${validatedData.experience.map((exp) => `<li>${exp}</li>`).join('')}</ul>
          <h3>Expectations:</h3>
          <p>${validatedData.expectations}</p>
          <hr>
          <p>View all registrations in the admin dashboard.</p>
        `,
        cc: ['fmtsoftwaresolutions@gmail.com'],
      });
    } catch (adminEmailError) {
      console.error('Error sending admin notification:', adminEmailError);
      // Don't fail the registration if admin email fails
    }

    return NextResponse.json(
      {
        message: 'Registration completed successfully',
        registrationId: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
