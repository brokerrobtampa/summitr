import { Link } from 'react-router-dom';
import type { ForumThreadSummary } from '@summit/shared';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Props {
  thread: ForumThreadSummary;
}

export function ThreadItem({ thread }: Props) {
  return (
    <Link
      to={`/forums/threads/${thread.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      {/* Author avatar */}
      <div className="w-8 h-8 rounded-full bg-peak-blue/10 text-peak-blue flex items-center justify-center font-semibold text-xs shrink-0">
        {(thread.author.displayName || thread.author.username).charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {thread.isPinned && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Pinned</span>
          )}
          {thread.isLocked && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Locked</span>
          )}
          <span className="font-medium text-gray-900 truncate">{thread.title}</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {thread.author.displayName || thread.author.username}
          <span className="mx-1">&middot;</span>
          {timeAgo(thread.createdAt)}
        </div>
      </div>

      {/* Reply count */}
      <div className="text-right shrink-0">
        <div className="text-sm font-medium text-gray-700">{thread.replyCount}</div>
        <div className="text-xs text-gray-500">{thread.replyCount === 1 ? 'reply' : 'replies'}</div>
      </div>
    </Link>
  );
}
