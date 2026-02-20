import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { PublicUser } from '@summit/shared';
import { FollowButton } from './FollowButton.js';
import * as socialApi from '../../api/social.api.js';
import { ApiError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: number;
  mode: 'followers' | 'following';
}

function UserAvatar({ avatarUrl, username }: { avatarUrl: string | null; username: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

export function UserListModal({ isOpen, onClose, title, userId, mode }: UserListModalProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUsers = useCallback(async (pageNum: number, append = false) => {
    try {
      setError(null);
      const fetcher = mode === 'followers' ? socialApi.getFollowers : socialApi.getFollowing;
      const res = await fetcher(userId, pageNum);

      setUsers((prev) => (append ? [...prev, ...res.data] : res.data));
      setHasMore(res.pagination.page < res.pagination.totalPages);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load users';
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [userId, mode]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setUsers([]);
      setPage(1);
      fetchUsers(1);
    }
  }, [isOpen, fetchUsers]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchUsers(nextPage, true);
  }

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-2">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-peak-blue rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 my-3">
              {error}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && users.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">
                {mode === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
              </p>
            </div>
          )}

          {/* User List */}
          {users.length > 0 && (
            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-3">
                  <Link to={`/users/${u.username}`} onClick={onClose} className="flex-shrink-0">
                    <UserAvatar avatarUrl={u.avatarUrl} username={u.username} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/users/${u.username}`}
                      onClick={onClose}
                      className="block"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate hover:underline">
                        {u.displayName || u.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                    </Link>
                  </div>
                  {currentUser && currentUser.id !== u.id && (
                    <FollowButton
                      userId={u.id}
                      initialIsFollowing={u.isFollowing ?? false}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center py-3">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-sm text-peak-blue hover:underline disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
