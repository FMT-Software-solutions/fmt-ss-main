import { ContactFormEmail } from '@/emails/ContactFormEmail';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { error: dbError } = await supabase.from('messages').insert({
      name,
      email,
      message,
      status: 'pending',
    });

    if (dbError) {
      console.error('Error saving to database:', dbError);
      return Response.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'fmtsoftwaresolutions@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      react: ContactFormEmail({ name, email, message }),
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      // Update message status to failed
      await supabase
        .from('messages')
        .update({ status: 'failed' })
        .eq('email', email)
        .eq('created_at', new Date().toISOString());

      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update message status to sent
    await supabase
      .from('messages')
      .update({ status: 'sent' })
      .eq('email', email)
      .eq('created_at', new Date().toISOString());

    return Response.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact form handler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
