'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

// This hook handles fetching and managing training registration counts
export function useRegistrationCount(trainingId: string) {
  const [registeredParticipants, setRegisteredParticipants] =
    useState<number>(0);
  const [maxParticipants, setMaxParticipants] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate derived values
  const hasMaxParticipants = maxParticipants !== null && maxParticipants > 0;
  const isFull =
    hasMaxParticipants && registeredParticipants >= maxParticipants;
  const availableSpots = hasMaxParticipants
    ? Math.max(0, maxParticipants - registeredParticipants)
    : null;

  // Function to fetch the latest counts from Sanity
  const fetchCounts = async () => {
    setLoading(true);
    try {
      const query = `*[_id == $trainingId][0]{
        registeredParticipants,
        maxParticipants
      }`;

      const result = await client.fetch(query, { trainingId });

      if (result) {
        setRegisteredParticipants(result.registeredParticipants || 0);
        setMaxParticipants(result.maxParticipants || null);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching registration counts:', err);
      setError('Failed to load registration data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    if (trainingId) {
      fetchCounts();
    }
  }, [trainingId]);

  return {
    registeredParticipants,
    maxParticipants,
    hasMaxParticipants,
    isFull,
    availableSpots,
    loading,
    error,
    refresh: fetchCounts,
  };
}

export default useRegistrationCount;
