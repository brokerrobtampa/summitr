import { api } from './client.js';
import type {
  ApiResponse,
  ForumCategory,
  ForumThread,
  ForumThreadSummary,
  ForumReply,
} from '@summit/shared';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getCategories() {
  return api.get<ApiResponse<ForumCategory[]>>('/forums/categories');
}

export function getContinentCategories() {
  return api.get<ApiResponse<ForumCategory[]>>('/forums/continents');
}

export function getCategoryBySlug(slug: string) {
  return api.get<ApiResponse<ForumCategory>>(`/forums/categories/${slug}`);
}

export function getPeakCategory(peakId: number) {
  return api.get<ApiResponse<ForumCategory>>(`/forums/peaks/${peakId}`);
}

export function getThreads(categoryId: number, page = 1, limit = 20) {
  return api.get<PaginatedResponse<ForumThreadSummary>>(
    `/forums/categories/${categoryId}/threads?page=${page}&limit=${limit}`,
  );
}

export function getThread(threadId: number) {
  return api.get<ApiResponse<ForumThread>>(`/forums/threads/${threadId}`);
}

export function createThread(categoryId: number, data: { title: string; body: string; imageUrl?: string }) {
  return api.post<ApiResponse<ForumThread>>(`/forums/categories/${categoryId}/threads`, data);
}

export function getReplies(threadId: number, page = 1, limit = 20) {
  return api.get<PaginatedResponse<ForumReply>>(
    `/forums/threads/${threadId}/replies?page=${page}&limit=${limit}`,
  );
}

export function createReply(threadId: number, data: { body: string; parentReplyId?: number; imageUrl?: string }) {
  return api.post<ApiResponse<ForumReply>>(`/forums/threads/${threadId}/replies`, data);
}
