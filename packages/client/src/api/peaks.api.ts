import { api } from './client.js';
import type { ApiResponse, PaginatedResponse, PeakSummary, PeakDetail, RouteSummary } from '@summit/shared';

export function getPeaks(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => query.set(k, String(v)));
  return api.get<PaginatedResponse<PeakSummary>>(`/peaks?${query.toString()}`);
}

export function getPeak(id: number) {
  return api.get<ApiResponse<PeakDetail>>(`/peaks/${id}`);
}

export function getPeakRoutes(peakId: number) {
  return api.get<ApiResponse<RouteSummary[]>>(`/peaks/${peakId}/routes`);
}

export function getPeaksByBounds(bounds: { north: number; south: number; east: number; west: number }) {
  const query = new URLSearchParams();
  Object.entries(bounds).forEach(([k, v]) => query.set(k, String(v)));
  return api.get<ApiResponse<PeakSummary[]>>(`/peaks/bounds?${query.toString()}`);
}
