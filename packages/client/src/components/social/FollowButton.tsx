import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import * as socialApi from '../../api/social.api.js';

interface FollowButtonProps {
  userId: number;
  initialIsFollowing: boolean;
  onToggle?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, initialIsFollowing, onToggle }: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <button
        disabled
        className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
      >
        Follow
      </button>
    );
  }

  // Don't show follow button for own profile
  if (user.id === userId) {
    return null;
  }

  async function handleClick() {
    if (isLoading) return;

    const nextState = !isFollowing;
    // Optimistic update
    setIsFollowing(nextState);
    setIsLoading(true);

    try {
      if (nextState) {
        await socialApi.followUser(userId);
      } else {
        await socialApi.unfollowUser(userId);
      }
      onToggle?.(nextState);
    } catch {
      // Revert on error
      setIsFollowing(!nextState);
    } finally {
      setIsLoading(false);
    }
  }

  if (isFollowing) {
    const showUnfollow = isHovered && !isLoading;
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
        className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition-colors duration-150 ${
          showUnfollow
            ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-peak-blue bg-peak-blue/10 text-peak-blue'
        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {showUnfollow ? 'Unfollow' : 'Following'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`text-sm font-medium px-4 py-1.5 rounded-lg border border-peak-blue text-peak-blue hover:bg-peak-blue hover:text-white transition-colors duration-150 ${
        isLoading ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      Follow
    </button>
  );
}
