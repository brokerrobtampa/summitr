import { api } from './client.js';
import type { ApiResponse, PaginatedResponse, RouteSummary, RouteDetail, CreateRouteInput } from '@summit/shared';

export function getRoutes(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => query.set(k, String(v)));
  return api.get<PaginatedResponse<RouteSummary>>(`/routes?${query.toString()}`);
}

export function getRoute(id: number) {
  return api.get<ApiResponse<RouteDetail>>(`/routes/${id}`);
}

export function createRoute(data: CreateRouteInput) {
  return api.post<ApiResponse<RouteDetail>>('/routes', data);
}

export function updateRoute(id: number, data: Partial<CreateRouteInput>) {
  return api.put<ApiResponse<RouteDetail>>(`/routes/${id}`, data);
}

export function deleteRoute(id: number) {
  return api.delete(`/routes/${id}`);
}

export function saveRoute(id: number) {
  return api.post(`/routes/${id}/save`);
}

export function unsaveRoute(id: number) {
  return api.delete(`/routes/${id}/save`);
}
