import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { CustomTrainingRegistrationEmail } from '@/emails/CustomTrainingRegistrationEmail';
import { TrainingRegistrationEmail } from '@/emails/TrainingRegistrationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { registrationId, email, registrationType } = await request.json();

    if (!registrationId || !email || !registrationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch registration data based on type
    let registrationData;
    let trainingData;

    if (registrationType === 'custom') {
      const { data: customReg, error: customError } = await supabase
        .from('custom_training_registrations')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (customError || !customReg) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      registrationData = customReg;

      // Fetch training data from Sanity
      const { client: sanityClient } = await import('@/sanity/lib/client');
      const training = await sanityClient.fetch(
        `*[_type == "training" && slug.current == $slug][0]{
          title,
          description,
          startDate,
          endDate,
          location,
          price,
          "slug": slug.current
        }`,
        { slug: customReg.training_slug }
      );

      trainingData = training;
    } else {
      const { data: regularReg, error: regularError } = await supabase
        .from('training_registrations')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (regularError || !regularReg) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      registrationData = regularReg;

      // Fetch training data from Sanity
      const { client: sanityClient } = await import('@/sanity/lib/client');
      const { trainingBySlugWithLinksQuery } = await import('@/sanity/lib/queries');
      const training = await sanityClient.fetch(
        trainingBySlugWithLinksQuery,
        { slug: regularReg.training_slug }
      );

      trainingData = training;
    }

    if (!trainingData) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    // Send confirmation email
    const emailComponent = registrationType === 'custom' 
      ? CustomTrainingRegistrationEmail({
          firstName: registrationData.first_name,
          training: trainingData,
          registrationDetails: registrationData.details,
        })
      : TrainingRegistrationEmail({
          firstName: registrationData.first_name,
          training: trainingData,
        });

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'FMT Software Solutions <training@fmtsoftware.com>',
      to: [email],
      subject: `Registration Confirmed: ${trainingData.title}`,
      react: emailComponent,
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Confirmation email sent successfully',
        emailId: emailData?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}