import { api } from './client.js';
import type { ApiResponse, SearchResults, AutocompleteResult } from '@summit/shared';

export function search(q: string, type = 'all') {
  return api.get<ApiResponse<SearchResults>>(`/search?q=${encodeURIComponent(q)}&type=${type}`);
}

export function autocomplete(q: string) {
  return api.get<ApiResponse<AutocompleteResult[]>>(`/search/autocomplete?q=${encodeURIComponent(q)}`);
}
