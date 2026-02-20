import type { PublicUser } from './user.js';

export interface UserFollowInfo {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Comment {
  id: number;
  climbLogId: number;
  authorId: number;
  body: string;
  createdAt: string;
  author: Pick<PublicUser, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface ActivityFeedItem {
  id: string;                // composite: "climb-123" or "review-456" or "route-789"
  type: 'climb' | 'review' | 'route';
  userId: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  timestamp: string;
  // Type-specific payloads (only one is populated)
  climbLog?: {
    id: number;
    peakName: string;
    peakId: number;
    routeName: string | null;
    routeId: number | null;
    success: boolean;
    photos: string[] | null;
    notes: string | null;
    elevation: number;
    commentCount: number;
    date: string;
  };
  review?: {
    id: number;
    routeId: number;
    routeName: string;
    peakName: string;
    rating: number;
    title: string | null;
    snippet: string;
  };
  route?: {
    id: number;
    name: string;
    peakName: string;
    difficulty: string | null;
    summary: string | null;
  };
}
