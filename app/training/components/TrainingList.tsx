'use client';

import { useState } from 'react';
import { ITrainingListItem } from '@/types/training';
import TrainingCard from './TrainingCard';
import TrainingFilters from './TrainingFilters';
import { EmptyState } from '@/components/EmptyState';
import { Calendar, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainingListProps {
  trainings: ITrainingListItem[];
  trainingTypes: any[];
}

export default function TrainingList({
  trainings,
  trainingTypes,
}: TrainingListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Filter trainings based on search query and filters
  const filteredTrainings = trainings
    .filter((training) => {
      // Search filter
      const matchesSearch =
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        training.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Type filter
      const matchesType =
        selectedType === 'all' ||
        training.trainingType.slug.current === selectedType;

      // Price filter
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && training.isFree) ||
        (priceFilter === 'paid' && !training.isFree);

      return matchesSearch && matchesType && matchesPrice;
    })
    .sort((a, b) => {
      // Sort by date or price
      if (sortBy === 'date-asc') {
        return (
          new Date(a.startDate || '').getTime() -
          new Date(b.startDate || '').getTime()
        );
      } else if (sortBy === 'date-desc') {
        return (
          new Date(b.startDate || '').getTime() -
          new Date(a.startDate || '').getTime()
        );
      } else if (sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="py-8">
      <TrainingFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        trainingTypes={trainingTypes}
      />

      {filteredTrainings.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {filteredTrainings.map((training) => (
            <TrainingCard key={training._id} training={training} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={trainings.length === 0 ? Calendar : PackageSearch}
          title={
            trainings.length === 0
              ? 'No training programs available'
              : 'No matching training programs'
          }
          description={
            trainings.length === 0
              ? "We don't have any training programs available at the moment. Please check back later."
              : "We couldn't find any training programs matching your filters. Try adjusting your search criteria."
          }
        >
          {trainings.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setPriceFilter('all');
                setSortBy('date-asc');
              }}
            >
              Reset filters
            </Button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
