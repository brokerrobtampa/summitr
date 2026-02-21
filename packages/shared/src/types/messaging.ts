export type ConversationType = 'direct' | 'group';
export type MessageType = 'text' | 'image' | 'system';
export type ParticipantRole = 'member' | 'admin';

export interface ConversationParticipant {
  id: number;
  userId: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: ParticipantRole;
  joinedAt: string;
  lastReadAt: string | null;
}

export interface MessageSummary {
  id: number;
  senderId: number;
  senderUsername: string;
  body: string;
  messageType: MessageType;
  createdAt: string;
}

export interface Conversation {
  id: number;
  type: ConversationType;
  title: string | null;
  tripId: number | null;
  participants: ConversationParticipant[];
  lastMessage: MessageSummary | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  senderDisplayName: string | null;
  senderAvatarUrl: string | null;
  body: string;
  messageType: MessageType;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketEvent {
  type: string;
  payload: unknown;
  timestamp: string;
}
