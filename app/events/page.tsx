import { Metadata } from 'next';
import { getEvents } from '@/lib/sanity';
import EventsList from './components/EventsList';
import EventsHero from './components/EventsHero';

export const metadata: Metadata = {
  title: 'Events | FMT Software Solutions',
  description:
    'Discover upcoming events from FMT Software Solutions. Join us for workshops, conferences, and networking opportunities.',
};

export const revalidate = 3600; // Revalidate at most every hour

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen">
      <EventsHero />
      <section className="container py-10">
        <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">
              No upcoming events at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <EventsList events={events} />
        )}
      </section>
    </div>
  );
}
