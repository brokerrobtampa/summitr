import { api } from './client.js';
import type { Conversation, Message } from '@summit/shared';

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getConversations(page = 1, limit = 20) {
  return api.get<PaginatedResponse<Conversation>>(
    `/conversations?page=${page}&limit=${limit}`,
  );
}

export function getConversation(id: number) {
  return api.get<{ success: boolean; data: Conversation }>(`/conversations/${id}`);
}

export function getMessages(conversationId: number, page = 1, limit = 50) {
  return api.get<PaginatedResponse<Message>>(
    `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
  );
}

export function sendMessage(conversationId: number, body: string) {
  return api.post<{ success: boolean; data: Message }>(
    `/conversations/${conversationId}/messages`,
    { body },
  );
}

export function createConversation(data: {
  type?: 'direct' | 'group';
  participantIds: number[];
  title?: string;
}) {
  return api.post<{ success: boolean; data: Conversation }>('/conversations', data);
}

export function markConversationRead(id: number) {
  return api.patch<{ success: boolean }>(`/conversations/${id}/read`);
}
