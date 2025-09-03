import { Metadata } from 'next';
import { getEvents } from '@/lib/sanity';
import EventsList from './components/EventsList';
import EventsHero from './components/EventsHero';

export const metadata: Metadata = {
  title: "Tech Events & Workshops | FMT Software Solutions - Join Our Community",
  description: "Join our upcoming tech events, workshops, and training sessions. Network with professionals, learn cutting-edge technologies, and advance your software development skills with FMT Software Solutions.",
  keywords: ["tech events", "software workshops", "training sessions", "networking", "professional development", "technology conferences", "FMT events", "software development training"],
  authors: [{ name: "FMT Software Solutions" }],
  creator: "FMT Software Solutions",
  publisher: "FMT Software Solutions",
  openGraph: {
    title: "Tech Events & Workshops | FMT Software Solutions",
    description: "Join our upcoming tech events, workshops, and training sessions. Network with professionals and advance your software development skills.",
    url: "https://fmtsoftware.com/events",
    siteName: "FMT Software Solutions",
    images: [
      {
        url: "https://fmtsoftware.com/images/fmt-bg.png",
        width: 1200,
        height: 630,
        alt: "FMT Software Solutions Events",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Events & Workshops | FMT Software Solutions",
    description: "Join our upcoming tech events, workshops, and training sessions. Network with professionals and advance your software development skills.",
    images: ["https://fmtsoftware.com/images/fmt-bg.png"],
    creator: "@FMTSoftware",
  },
  alternates: {
    canonical: "https://fmtsoftware.com/events",
  },
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
