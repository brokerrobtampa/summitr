import { Link } from 'react-router-dom';
import type { ActivityFeedItem as ActivityFeedItemType } from '@summit/shared';

interface ActivityFeedItemProps {
  item: ActivityFeedItemType;
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function UserAvatar({ avatarUrl, displayName, username }: { avatarUrl: string | null; displayName: string | null; username: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName || username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  const initial = (displayName || username).charAt(0).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-peak-blue/10 text-peak-blue flex items-center justify-center font-semibold text-sm flex-shrink-0">
      {initial}
    </div>
  );
}

function ClimbContent({ item }: { item: ActivityFeedItemType }) {
  const climb = item.climbLog;
  if (!climb) return null;

  return (
    <div>
      <p className="text-sm text-gray-800">
        <Link to={`/users/${item.username}`} className="font-semibold text-gray-900 hover:underline">
          {item.displayName || item.username}
        </Link>{' '}
        {climb.success ? 'summited' : 'attempted'}{' '}
        <Link to={`/peaks/${climb.peakId}`} className="font-medium text-peak-blue hover:underline">
          {climb.peakName}
        </Link>
        {climb.routeName && (
          <>
            {' via '}
            {climb.routeId ? (
              <Link to={`/routes/${climb.routeId}`} className="text-peak-blue hover:underline">
                {climb.routeName}
              </Link>
            ) : (
              <span>{climb.routeName}</span>
            )}
          </>
        )}
      </p>

      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
        <span>{climb.elevation.toLocaleString()}m</span>
        <span>{new Date(climb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        {climb.commentCount > 0 && (
          <span className="flex items-center gap-0.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {climb.commentCount}
          </span>
        )}
      </div>

      {climb.notes && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{climb.notes}</p>
      )}

      {climb.photos && climb.photos.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {climb.photos.slice(0, 4).map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`Climb photo ${i + 1}`}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
          ))}
          {climb.photos.length > 4 && (
            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
              +{climb.photos.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewContent({ item }: { item: ActivityFeedItemType }) {
  const review = item.review;
  if (!review) return null;

  return (
    <div>
      <p className="text-sm text-gray-800">
        <Link to={`/users/${item.username}`} className="font-semibold text-gray-900 hover:underline">
          {item.displayName || item.username}
        </Link>{' '}
        reviewed{' '}
        <Link to={`/routes/${review.routeId}`} className="font-medium text-peak-blue hover:underline">
          {review.routeName}
        </Link>
        {' on '}
        <span className="text-gray-700">{review.peakName}</span>
      </p>

      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xs ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              &#9733;
            </span>
          ))}
        </div>
        {review.title && (
          <span className="text-sm font-medium text-gray-700">{review.title}</span>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{review.snippet}</p>
    </div>
  );
}

function RouteContent({ item }: { item: ActivityFeedItemType }) {
  const route = item.route;
  if (!route) return null;

  return (
    <div>
      <p className="text-sm text-gray-800">
        <Link to={`/users/${item.username}`} className="font-semibold text-gray-900 hover:underline">
          {item.displayName || item.username}
        </Link>{' '}
        added a new route{' '}
        <Link to={`/routes/${route.id}`} className="font-medium text-peak-blue hover:underline">
          {route.name}
        </Link>
        {' on '}
        <span className="text-gray-700">{route.peakName}</span>
      </p>

      <div className="flex items-center gap-2 mt-1.5">
        {route.difficulty && (
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {route.difficulty}
          </span>
        )}
      </div>

      {route.summary && (
        <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{route.summary}</p>
      )}
    </div>
  );
}

export function ActivityFeedItem({ item }: ActivityFeedItemProps) {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
      <Link to={`/users/${item.username}`} className="flex-shrink-0">
        <UserAvatar
          avatarUrl={item.avatarUrl}
          displayName={item.displayName}
          username={item.username}
        />
      </Link>

      <div className="flex-1 min-w-0">
        {item.type === 'climb' && <ClimbContent item={item} />}
        {item.type === 'review' && <ReviewContent item={item} />}
        {item.type === 'route' && <RouteContent item={item} />}

        <span className="text-xs text-gray-400 mt-1 block">
          {formatRelativeTime(item.timestamp)}
        </span>
      </div>
    </div>
  );
}
