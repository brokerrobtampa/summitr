export type NotificationType =
  | 'follow'
  | 'comment'
  | 'trip_invite'
  | 'message'
  | 'booking_request'
  | 'forum_reply'
  | 'review'
  | 'route_update';

export interface NotificationActor {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Notification {
  id: number;
  recipientId: number;
  actorId: number | null;
  actor: NotificationActor | null;
  type: NotificationType;
  entityType: string | null;
  entityId: number | null;
  title: string;
  body: string | null;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}
