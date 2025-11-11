import { useState } from 'react';
import { useLocationAutocompleteQuery } from '@/api/query/queries/useLocationQueries';
import { useDebouncedValue } from './useDebouncedValue';
import type { LocationAutocompleteSuggestion } from '@/api/types';

interface UseLocationAutocompleteOptions {
  debounceMs?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseLocationAutocompleteResult {
  suggestions: LocationAutocompleteSuggestion[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
}

/**
 * Hook for location autocomplete with debounce using React Query
 * 
 * Benefits of using useQuery:
 * - Automatic caching
 * - Request deduplication
 * - Automatic retry on failure
 * - Better loading/error state management
 * - Integration with React Query DevTools
 */
export const useLocationAutocomplete = (
  options: UseLocationAutocompleteOptions = {}
): UseLocationAutocompleteResult => {
  const { debounceMs = 1000, limit = 8, enabled = true } = options;
  const [query, setQuery] = useState('');

  // Debounce the query value
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  // Use React Query for the actual API call
  const {
    data: response,
    isLoading,
    error: queryError,
  } = useLocationAutocompleteQuery(debouncedQuery, limit, enabled);

  const search = (newQuery: string) => {
    setQuery(newQuery);
  };

  const clear = () => {
    setQuery('');
  };

  // Extract suggestions from response
  const suggestions =
    response?.success && Array.isArray(response.data) ? response.data : [];

  // Extract error message
  const error = queryError
    ? (queryError as any)?.message || 'Failed to fetch suggestions'
    : null;

  return {
    suggestions,
    isLoading,
    error,
    search,
    clear,
  };
};

