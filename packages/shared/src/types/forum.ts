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
  parentId: number | null;
  sortOrder: number;
  threadCount: number;
  childCount?: number;
  lastActivity: string | null;
  createdAt: string;
  children?: ForumCategory[];
}

export interface ForumThreadSummary {
  id: number;
  categoryId: number;
  title: string;
  imageUrl: string | null;
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
  imageUrl: string | null;
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
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
