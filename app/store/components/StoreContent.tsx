'use client';

import { useState, createContext } from 'react';
import StoreFilters, { FilterState } from './StoreFilters';
import ProductGrid from './ProductGrid';

// Create a context to share filter state across components
export const FilterContext = createContext<FilterState | null>(null);

export default function StoreContent() {
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
      <ProductGrid />
    </FilterContext.Provider>
  );
}
