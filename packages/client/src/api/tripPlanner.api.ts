import { api } from './client.js';
import type { TripPlannerResponse, TripPlannerFilters } from '@summit/shared';

export function searchTrips(filters: TripPlannerFilters = {}) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === '' || v === null) return;
    if (Array.isArray(v)) {
      if (v.length > 0) query.set(k, v.join(','));
    } else {
      query.set(k, String(v));
    }
  });
  return api.get<{ success: boolean } & TripPlannerResponse>(`/trip-planner?${query.toString()}`);
}
