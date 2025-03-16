'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// Fetch sectors from Sanity
const sectorsQuery = groq`
  *[_type == "sector"] | order(name asc) {
    name,
    "slug": slug.current
  }
`;

// Status options
const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Upcoming', value: 'upcoming' },
];

export default function ProjectsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sectors, setSectors] = useState<{ label: string; value: string }[]>([
    { label: 'All Sectors', value: 'all' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sectors from Sanity
  useEffect(() => {
    async function fetchSectors() {
      try {
        if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          setIsLoading(false);
          return;
        }

        const data = await client.fetch(sectorsQuery);
        const formattedSectors = [
          { label: 'All Sectors', value: 'all' },
          ...data.map((sector: { name: string; slug: string }) => ({
            label: sector.name,
            value: sector.slug,
          })),
        ];
        setSectors(formattedSectors);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSectors();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (sector && sector !== 'all') {
      params.set('sector', sector);
    } else {
      params.delete('sector');
    }

    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    const newUrl = `/projects${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [search, sector, status, router, searchParams]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the URL update
  };

  // Handle reset filters
  const handleReset = () => {
    setSearch('');
    setSector('all');
    setStatus('all');
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        <div className="flex gap-2">
          <Select value={sector} onValueChange={setSector} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleReset}
            className="flex gap-2"
          >
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
