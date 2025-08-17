'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange';
  options?: Array<{ value: string; label: string }>;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onSearch?: (term: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onClear?: () => void;
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  filters = [],
  onSearch,
  onFilter,
  onClear,
}: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleDateRangeChange = (key: string, range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    handleFilterChange(key, range);
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setDateRange({ from: undefined, to: undefined });
    onClear?.();
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            if (filter.type === 'select') {
              return (
                <Select
                  key={filter.key}
                  value={activeFilters[filter.key] || 'all'}
                  onValueChange={(value) => handleFilterChange(filter.key, value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }

            if (filter.type === 'dateRange') {
              return (
                <Popover key={filter.key}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !dateRange.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>{filter.label}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => handleDateRangeChange(filter.key, range || { from: undefined, to: undefined } as any)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              );
            }

            return null;
          })}

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            
            const filter = filters.find((f) => f.key === key);
            if (!filter) return null;

            let displayValue = value;
            if (filter.type === 'select' && filter.options) {
              const option = filter.options.find((opt) => opt.value === value);
              displayValue = option?.label || value;
            } else if (filter.type === 'dateRange' && value.from) {
              displayValue = value.to
                ? `${format(value.from, 'MMM dd')} - ${format(value.to, 'MMM dd')}`
                : format(value.from, 'MMM dd');
            }

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {filter.label}: {displayValue}
                <button
                  onClick={() => clearFilter(key)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}