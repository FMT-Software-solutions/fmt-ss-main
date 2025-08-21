'use client';

import { useState, useEffect, createContext } from 'react';
import StoreFilters, { FilterState } from './StoreFilters';
import ProductGrid from './ProductGrid';
import { IPremiumAppListItem } from '@/types/premium-app';
import { issuesClient } from '@/services/issues/client';
import { toast } from 'sonner';
import { client } from '@/sanity/lib/client';
import { allPremiumAppsQuery } from '@/sanity/lib/queries';

// Create a context to share filter state across components
export const FilterContext = createContext<FilterState | null>(null);

interface StoreContentProps {
  premiumApps: IPremiumAppListItem[];
}

export default function StoreContent({ premiumApps }: StoreContentProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState(premiumApps);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await client.fetch(allPremiumAppsQuery);
        setProducts(products);
      } catch (error) {
        // Log product fetch error
        await issuesClient.logAppError(
          error instanceof Error ? error : 'Failed to fetch products from Sanity',
          'StoreContent',
          'data_fetch',
          'medium',
          { error: error instanceof Error ? error.message : String(error) }
        );
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <ProductGrid premiumApps={products} />
    </FilterContext.Provider>
  );
}
