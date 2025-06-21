'use client';

import { useState, useMemo } from 'react';
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
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  const filteredTrainings = useMemo(() => {
    return trainings.filter((training) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        training.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Type filter - handle both old and new schema
      const matchesType =
        selectedType === 'all' ||
        checkTrainingTypeMatch(training, selectedType);

      // Price filter
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && training.isFree) ||
        (priceFilter === 'paid' && !training.isFree);

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [trainings, selectedType, searchQuery, priceFilter]);

  // Helper function to check if training matches selected type
  const checkTrainingTypeMatch = (
    training: ITrainingListItem,
    selectedType: string
  ): boolean => {
    // Check new trainingTypes array first
    if (training.trainingTypes && training.trainingTypes.length > 0) {
      return training.trainingTypes.some(
        (type) => type.slug?.current === selectedType
      );
    }

    // Fall back to old single trainingType
    if (training.trainingType && training.trainingType.slug) {
      return training.trainingType.slug.current === selectedType;
    }

    return false;
  };

  return (
    <div className="space-y-8">
      <TrainingFilters
        setSelectedType={setSelectedType}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        selectedType={selectedType}
        trainingTypes={trainingTypes}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filteredTrainings.length === 0 ? (
        <EmptyState
          icon={trainings.length === 0 ? Calendar : PackageSearch}
          title={
            trainings.length === 0
              ? 'No training programs available'
              : 'No matching training programs'
          }
          description={
            searchQuery || selectedType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Check back soon for upcoming training programs'
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainings.map((training) => (
            <TrainingCard key={training._id} training={training} />
          ))}
        </div>
      )}

      {/* Training count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredTrainings.length} of {trainings.length} training
        {trainings.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
