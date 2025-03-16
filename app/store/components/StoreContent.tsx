'use client';

import { useState, createContext } from 'react';
import StoreFilters, { FilterState } from './StoreFilters';
import ProductGrid from './ProductGrid';
import { IPremiumAppListItem } from '@/types/premium-app';

// Create a context to share filter state across components
export const FilterContext = createContext<FilterState | null>(null);

interface StoreContentProps {
  premiumApps: IPremiumAppListItem[];
}

export default function StoreContent({ premiumApps }: StoreContentProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        category,
        setCategory,
        sortBy,
        setSortBy,
      }}
    >
      <StoreFilters />
      <ProductGrid premiumApps={premiumApps} />
    </FilterContext.Provider>
  );
}
