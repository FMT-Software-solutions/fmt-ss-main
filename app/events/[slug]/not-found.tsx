import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EventNotFound() {
  return (
    <div className="container max-w-3xl flex flex-col items-center text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The event you are looking for does not exist or may have been removed.
      </p>
      <Link href="/events">
        <Button size="lg">Browse All Events</Button>
      </Link>
    </div>
  );
}
