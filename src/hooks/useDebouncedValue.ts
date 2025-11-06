import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value
 * 
 * @example
 * const debouncedQuery = useDebouncedValue(query, 1000);
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

