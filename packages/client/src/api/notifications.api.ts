import { api } from './client.js';
import type { NotificationListResponse, UnreadCountResponse } from '@summit/shared';

export function getNotifications(page = 1, limit = 20, unreadOnly = false) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (unreadOnly) params.set('unreadOnly', 'true');
  return api.get<NotificationListResponse>(`/notifications?${params}`);
}

export function getUnreadCount() {
  return api.get<UnreadCountResponse>('/notifications/unread-count');
}

export function markAsRead(id: number) {
  return api.patch<{ success: boolean }>(`/notifications/${id}/read`);
}

export function markAllRead() {
  return api.patch<{ success: boolean }>('/notifications/read-all');
}
