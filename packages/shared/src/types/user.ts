export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  experienceLevel: string | null;
  climbingStyles: string[] | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: number;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  experienceLevel: string | null;
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface UserStats {
  totalPeaks: number;
  totalClimbs: number;
  totalElevationGain: number;
  highestPeak: { name: string; elevation: number } | null;
  climbsByYear: Record<number, number>;
  elevationByYear: Record<number, number>;
}

export interface AuthResponse {
  token: string;
  user: User;
}
