import { Link } from 'react-router-dom';
import type { ForumReply } from '@summit/shared';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  reply: ForumReply;
  onReply?: () => void;
}

export function ReplyItem({ reply, onReply }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-peak-blue/10 text-peak-blue flex items-center justify-center font-semibold text-xs shrink-0">
          {(reply.author.displayName || reply.author.username).charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to={`/users/${reply.author.username}`}
              className="font-medium text-gray-900 hover:text-peak-blue"
            >
              {reply.author.displayName || reply.author.username}
            </Link>
            <span className="text-gray-400">&middot;</span>
            <span className="text-gray-500">{formatDate(reply.createdAt)}</span>
          </div>
          <div className="mt-2 text-gray-700 text-sm whitespace-pre-wrap">{reply.body}</div>
          {reply.imageUrl && (
            <div className="mt-3">
              <img
                src={reply.imageUrl}
                alt="Reply image"
                className="max-w-full max-h-[400px] rounded-lg border border-gray-200 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
          {onReply && (
            <button
              onClick={onReply}
              className="mt-2 text-xs text-peak-blue hover:underline"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
