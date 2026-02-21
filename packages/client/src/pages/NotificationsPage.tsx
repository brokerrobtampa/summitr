import { NotificationCenter } from '../components/notifications/NotificationCenter.js';

export function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationCenter />
    </div>
  );
}
