import { api } from './client.js';
import type { ActivityFeedItem, Comment } from '@summit/shared';

export async function followUser(userId: number) {
  return api.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId: number) {
  return api.delete(`/users/${userId}/follow`);
}

export async function getFollowers(userId: number, page = 1) {
  return api.get<{ data: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/users/${userId}/followers?page=${page}`);
}

export async function getFollowing(userId: number, page = 1) {
  return api.get<{ data: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/users/${userId}/following?page=${page}`);
}

export async function getFeed(page = 1, limit = 20) {
  return api.get<{ data: ActivityFeedItem[] }>(`/feed?page=${page}&limit=${limit}`);
}

export async function getDiscoverFeed(page = 1, limit = 20) {
  return api.get<{ data: ActivityFeedItem[] }>(`/feed/discover?page=${page}&limit=${limit}`);
}

export async function getComments(climbLogId: number, page = 1) {
  return api.get<{ data: Comment[] }>(`/climbs/${climbLogId}/comments?page=${page}`);
}

export async function addComment(climbLogId: number, body: string) {
  return api.post<{ data: Comment }>(`/climbs/${climbLogId}/comments`, { body });
}

export async function deleteComment(commentId: number) {
  return api.delete(`/comments/${commentId}`);
}
