import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainingId = searchParams.get('trainingId');
    const trainingSlug = searchParams.get('trainingSlug');

    if (!trainingId && !trainingSlug) {
      return Response.json(
        { error: 'Training ID or Slug is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build the query based on whether ID or slug was provided
    let query = supabase.from('training_registrations').select('*');

    if (trainingId) {
      query = query.eq('training_id', trainingId);
    } else if (trainingSlug) {
      query = query.eq('training_slug', trainingSlug);
    }

    // Order by creation date
    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Error fetching attendees:', error);
      return Response.json(
        { error: 'Failed to fetch attendees' },
        { status: 500 }
      );
    }

    // Map the data to return only needed fields
    const attendees = data.map((attendee) => ({
      id: attendee.id,
      firstName: attendee.first_name,
      lastName: attendee.last_name,
      email: attendee.email,
      phone: attendee.phone,
      company: attendee.company,
      status: attendee.status,
      registeredAt: attendee.created_at,
    }));

    return Response.json({ attendees });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
