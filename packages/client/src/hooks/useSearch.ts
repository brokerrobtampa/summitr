import { useState, useEffect } from 'react';
import * as searchApi from '../api/search.api.js';
import type { AutocompleteResult } from '@summit/shared';

export function useAutocomplete(query: string, delay = 300) {
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchApi.autocomplete(query);
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, isLoading };
}
