import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '@summit/shared';
import { useAuth } from '../../context/AuthContext.js';
import * as socialApi from '../../api/social.api.js';
import { ApiError } from '../../api/client.js';

interface CommentSectionProps {
  climbLogId: number;
  initialCommentCount?: number;
}

function formatCommentTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function CommentAvatar({ avatarUrl, username }: { avatarUrl: string | null; username: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

export function CommentSection({ climbLogId, initialCommentCount = 0 }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setError(null);
      const res = await socialApi.getComments(climbLogId);
      setComments(res.data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load comments';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [climbLogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await socialApi.addComment(climbLogId, trimmed);
      setComments((prev) => [...prev, res.data]);
      setBody('');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to post comment';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (deletingId !== null) return;
    setDeletingId(commentId);
    try {
      await socialApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete comment';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments
        {(comments.length > 0 || initialCommentCount > 0) && (
          <span className="text-xs text-gray-400 font-normal">
            ({comments.length || initialCommentCount})
          </span>
        )}
      </h4>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-peak-blue rounded-full animate-spin" />
        </div>
      )}

      {/* Comments List */}
      {!isLoading && comments.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center">No comments yet. Be the first to comment.</p>
      )}

      {!isLoading && comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 group">
              <Link to={`/users/${comment.author.username}`} className="flex-shrink-0">
                <CommentAvatar
                  avatarUrl={comment.author.avatarUrl}
                  username={comment.author.username}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/users/${comment.author.username}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    {comment.author.displayName || comment.author.username}
                  </Link>
                  <span className="text-xs text-gray-400">{formatCommentTime(comment.createdAt)}</span>
                  {user && user.id === comment.authorId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                      title="Delete comment"
                    >
                      {deletingId === comment.id ? (
                        <div className="w-3 h-3 border border-gray-300 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2.5">
          <div className="flex-shrink-0">
            <CommentAvatar avatarUrl={user.avatarUrl} username={user.username} />
          </div>
          <div className="flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-peak-blue/30 focus:border-peak-blue placeholder-gray-400"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="submit"
                disabled={!body.trim() || isSubmitting}
                className="text-sm font-medium text-white bg-peak-blue hover:bg-peak-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-400 text-center py-2">
          <Link to="/login" className="text-peak-blue hover:underline">Sign in</Link> to leave a comment.
        </p>
      )}
    </div>
  );
}
