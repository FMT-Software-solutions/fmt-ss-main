'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

interface TrainingFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  trainingTypes: any[];
}

export default function TrainingFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy,
  trainingTypes,
}: TrainingFiltersProps) {
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle reset filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setPriceFilter('all');
    setSortBy('date-asc');
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trainings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Training Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {trainingTypes.map((type) => (
                <SelectItem key={type._id} value={type.slug.current}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date: Upcoming First</SelectItem>
              <SelectItem value="date-desc">Date: Latest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
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
