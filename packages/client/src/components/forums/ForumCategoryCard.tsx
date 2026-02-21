import type { ForumCategory } from '@summit/shared';

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
  category: ForumCategory;
}

export function ForumCategoryCard({ category }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
          )}
        </div>
        <div className="text-right ml-4 shrink-0">
          <div className="text-sm font-medium text-gray-900">
            {category.threadCount} {category.threadCount === 1 ? 'thread' : 'threads'}
          </div>
          {category.lastActivity && (
            <div className="text-xs text-gray-500 mt-0.5">
              Last activity {timeAgo(category.lastActivity)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
