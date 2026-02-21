import { useState } from 'react';
import { useNotifications, useMarkAsRead, useMarkAllRead } from '../../hooks/useNotifications.js';
import { NotificationItem } from './NotificationItem.js';

export function NotificationCenter() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data, isLoading } = useNotifications(page);
  const markAsRead = useMarkAsRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  // Filter client-side for unread tab
  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-peak-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'unread'
                ? 'bg-peak-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
        </div>
        <button
          onClick={() => markAllRead.mutate()}
          className="text-sm text-peak-blue hover:text-blue-700 font-medium"
        >
          Mark all as read
        </button>
      </div>

      {/* Notification list */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={(id) => markAsRead.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
