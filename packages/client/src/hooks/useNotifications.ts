import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as notificationsApi from '../api/notifications.api.js';
import { useWs } from '../context/WebSocketContext.js';
import { useAuth } from '../context/AuthContext.js';

export function useNotifications(page = 1) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', 'list', page],
    queryFn: () => notificationsApi.getNotifications(page),
    enabled: !!user,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  const { subscribe } = useWs();
  const queryClient = useQueryClient();

  // Listen for real-time notifications and invalidate the count
  useEffect(() => {
    const unsub = subscribe('notification', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
    return unsub;
  }, [subscribe, queryClient]);

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 60_000, // Poll every 60s as fallback
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
