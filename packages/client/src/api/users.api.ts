import { api } from './client.js';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  ClimbLog,
  UserStats,
  RouteSummary,
  UpdateProfileInput,
  CreateClimbLogInput,
  UpdateClimbLogInput,
} from '@summit/shared';

export function getProfile() {
  return api.get<ApiResponse<User>>('/auth/me');
}

export function updateProfile(data: UpdateProfileInput) {
  return api.put<ApiResponse<User>>('/users/me', data);
}

export function getClimbs(page = 1, limit = 20) {
  return api.get<PaginatedResponse<ClimbLog>>(`/users/me/climbs?page=${page}&limit=${limit}`);
}

export function createClimb(data: CreateClimbLogInput) {
  return api.post<ApiResponse<ClimbLog>>('/users/me/climbs', data);
}

export function updateClimb(id: number, data: UpdateClimbLogInput) {
  return api.put<ApiResponse<ClimbLog>>(`/users/me/climbs/${id}`, data);
}

export function deleteClimb(id: number) {
  return api.delete(`/users/me/climbs/${id}`);
}

export function getSavedRoutes() {
  return api.get<ApiResponse<RouteSummary[]>>('/users/me/saved');
}

export function getStats() {
  return api.get<ApiResponse<UserStats>>('/users/me/stats');
}

export function getPublicProfile(username: string) {
  return api.get<ApiResponse<any>>(`/users/${username}`);
}
