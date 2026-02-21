import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForumThread, useForumReplies, useCreateReply } from '../hooks/useForums.js';
import { useAuth } from '../context/AuthContext.js';
import { ReplyItem } from '../components/forums/ReplyItem.js';
import { ReplyForm } from '../components/forums/ReplyForm.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';

export function ForumThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<number | undefined>(undefined);

  const tid = parseInt(threadId || '0', 10);
  const { data: threadData, isLoading: threadLoading } = useForumThread(tid);
  const thread = threadData?.data;

  const { data: repliesData, isLoading: repliesLoading } = useForumReplies(tid, page);
  const replies = repliesData?.data ?? [];
  const pagination = repliesData?.pagination;

  const createReply = useCreateReply(tid);

  const handleReply = async (body: string, parentReplyId?: number, imageUrl?: string) => {
    await createReply.mutateAsync({ body, parentReplyId, imageUrl });
    setReplyingTo(undefined);
  };

  if (threadLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Thread not found.
      </div>
    );
  }

  // Separate top-level and nested replies
  const topLevelReplies = replies.filter((r) => !r.parentReplyId);
  const nestedReplies = replies.filter((r) => r.parentReplyId);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/forums" className="text-peak-blue hover:underline">Forums</Link>
        <span className="mx-2">/</span>
        <Link to={`/forums/${thread.category.slug}`} className="text-peak-blue hover:underline">
          {thread.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{thread.title}</span>
      </div>

      {/* Thread Header + Body */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-peak-blue/10 text-peak-blue flex items-center justify-center font-semibold text-sm shrink-0">
            {(thread.author.displayName || thread.author.username).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{thread.title}</h1>
              {thread.isPinned && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Pinned</span>
              )}
              {thread.isLocked && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Locked</span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <Link to={`/users/${thread.author.username}`} className="text-peak-blue hover:underline">
                {thread.author.displayName || thread.author.username}
              </Link>
              <span className="mx-1">&middot;</span>
              <span>{formatDate(thread.createdAt)}</span>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-wrap">{thread.body}</div>
            {thread.imageUrl && (
              <div className="mt-4">
                <img
                  src={thread.imageUrl}
                  alt="Thread image"
                  className="max-w-full max-h-[500px] rounded-lg border border-gray-200 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {thread.replyCount} {thread.replyCount === 1 ? 'Reply' : 'Replies'}
        </h2>
      </div>

      {repliesLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : topLevelReplies.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No replies yet. Be the first to respond!
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelReplies.map((reply) => (
            <div key={reply.id}>
              <ReplyItem
                reply={reply}
                onReply={user && !thread.isLocked ? () => setReplyingTo(reply.id) : undefined}
              />
              {/* Nested replies */}
              {nestedReplies
                .filter((nr) => nr.parentReplyId === reply.id)
                .map((nested) => (
                  <div key={nested.id} className="ml-8">
                    <ReplyItem reply={nested} />
                  </div>
                ))}
              {/* Inline reply form for nested reply */}
              {replyingTo === reply.id && (
                <div className="ml-8 mt-2">
                  <ReplyForm
                    onSubmit={(body, imageUrl) => handleReply(body, reply.id, imageUrl)}
                    onCancel={() => setReplyingTo(undefined)}
                    isLoading={createReply.isPending}
                    placeholder={`Reply to ${reply.author.displayName || reply.author.username}...`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-500">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Reply form */}
      {user && !thread.isLocked && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Post a Reply</h3>
          <ReplyForm
            onSubmit={(body, imageUrl) => handleReply(body, undefined, imageUrl)}
            isLoading={createReply.isPending}
          />
        </div>
      )}

      {thread.isLocked && (
        <div className="mt-6 text-center py-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
          This thread is locked. No new replies can be added.
        </div>
      )}

      {!user && !thread.isLocked && (
        <div className="mt-6 text-center py-4 bg-gray-50 rounded-lg text-sm">
          <Link to="/login" className="text-peak-blue hover:underline">Sign in</Link>
          {' '}to reply to this thread.
        </div>
      )}
    </div>
  );
}
