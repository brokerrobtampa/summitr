import { api } from './client.js';
import type {
  ApiResponse,
  PaginatedResponse,
  ReviewWithAuthor,
  Tip,
  GearRecommendation,
  CreateReviewInput,
  CreateTipInput,
  CreateGearRecInput,
} from '@summit/shared';

// Reviews
export function getReviews(routeId: number, page = 1) {
  return api.get<PaginatedResponse<ReviewWithAuthor>>(`/routes/${routeId}/reviews?page=${page}`);
}

export function createReview(routeId: number, data: CreateReviewInput) {
  return api.post<ApiResponse<ReviewWithAuthor>>(`/routes/${routeId}/reviews`, data);
}

export function deleteReview(id: number) {
  return api.delete(`/reviews/${id}`);
}

// Tips
export function getTips(routeId: number) {
  return api.get<ApiResponse<Tip[]>>(`/routes/${routeId}/tips`);
}

export function createTip(routeId: number, data: CreateTipInput) {
  return api.post<ApiResponse<Tip>>(`/routes/${routeId}/tips`, data);
}

export function deleteTip(id: number) {
  return api.delete(`/tips/${id}`);
}

// Gear
export function getGear(routeId: number) {
  return api.get<ApiResponse<GearRecommendation[]>>(`/routes/${routeId}/gear`);
}

export function createGearRec(routeId: number, data: CreateGearRecInput) {
  return api.post<ApiResponse<GearRecommendation>>(`/routes/${routeId}/gear`, data);
}

export function deleteGearRec(id: number) {
  return api.delete(`/gear/${id}`);
}
