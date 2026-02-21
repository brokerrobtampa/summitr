import { useNavigate } from 'react-router-dom';
import type { Notification } from '@summit/shared';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'follow':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      );
    case 'comment':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
          <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6z" clipRule="evenodd" />
        </svg>
      );
  }
}

interface Props {
  notification: Notification;
  onRead?: (id: number) => void;
  compact?: boolean;
}

export function NotificationItem({ notification, onRead, compact = false }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Mark as read
    if (!notification.isRead && onRead) {
      onRead(notification.id);
    }

    // Navigate to relevant page
    if (notification.type === 'follow' && notification.actor) {
      navigate(`/users/${notification.actor.username}`);
    } else if (notification.type === 'comment' && notification.entityType === 'climbLog') {
      navigate(`/feed`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50/50' : ''
      } ${compact ? 'py-2.5' : ''}`}
    >
      {/* Actor avatar or type icon */}
      <div className="shrink-0 mt-0.5">
        {notification.actor?.avatarUrl ? (
          <img
            src={notification.actor.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
          {notification.title}
        </p>
        {notification.body && !compact && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{notification.body}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notification.createdAt)}</p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="shrink-0 mt-2">
          <div className="w-2 h-2 rounded-full bg-peak-blue" />
        </div>
      )}
    </button>
  );
}
