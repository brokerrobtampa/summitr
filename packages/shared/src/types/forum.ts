export interface ForumCategoryAuthor {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  peakId: number | null;
  sortOrder: number;
  threadCount: number;
  lastActivity: string | null;
  createdAt: string;
}

export interface ForumThreadSummary {
  id: number;
  categoryId: number;
  title: string;
  author: ForumCategoryAuthor;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivityAt: string;
  createdAt: string;
}

export interface ForumThread {
  id: number;
  categoryId: number;
  category: { id: number; name: string; slug: string };
  author: ForumCategoryAuthor;
  title: string;
  body: string;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: number;
  threadId: number;
  author: ForumCategoryAuthor;
  parentReplyId: number | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}
