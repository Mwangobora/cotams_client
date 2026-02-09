import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi, type NotificationFilters } from '@/apis/NotificationsApi';
import { getWebSocketClient, type WSMessage } from '@/lib/ws';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (filters: NotificationFilters) => ['notifications', 'list', filters] as const,
  unread: ['notifications', 'unread'] as const,
  stats: ['notifications', 'stats'] as const,
};

export function useNotificationsQuery(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(filters),
    queryFn: () => notificationsApi.list(filters),
    enabled: !!Cookies.get('access_token'),
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unread,
    queryFn: () => notificationsApi.unreadCount(),
    enabled: !!Cookies.get('access_token'),
    staleTime: 60 * 1000,
  });
}

export function useNotificationStatsQuery() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.stats,
    queryFn: () => notificationsApi.stats(),
    enabled: !!Cookies.get('access_token'),
  });
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}

export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!Cookies.get('access_token')) return;
    const wsClient = getWebSocketClient();
    const showToast = (title?: string, message?: string, eventType?: string) => {
      if (!title && !message) return;
      // Show success (green) for normal notifications, error (red) for clash/error events
      const isError = eventType?.includes('clash') || eventType?.includes('error');
      console.log(`🎨 Showing toast [${isError ? 'ERROR' : 'SUCCESS'}]:`, { title, message, eventType });
      if (isError) {
        toast.error(title || 'Error', { description: message });
      } else {
        toast.success(title || 'Notification', { description: message });
      }
    };
    const onNotification = (msg: WSMessage) => {
      console.log('🔔 [useRealtimeNotifications] Notification received:', msg);
      showToast(msg.title, msg.message, msg.event_type);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    };
    const onAnnouncement = (msg: WSMessage) => {
      console.log('📢 [useRealtimeNotifications] Announcement received:', msg);
      showToast(msg.title || 'Announcement', msg.message, 'announcement');
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    };
    const onSystem = (msg: WSMessage) => {
      console.log('⚙️ [useRealtimeNotifications] System message received:', msg);
      showToast(msg.title || 'System', msg.message, 'system');
    };
    wsClient.on('notification', onNotification);
    wsClient.on('announcement', onAnnouncement);
    wsClient.on('system', onSystem);
    console.log('🔌 [useRealtimeNotifications] WebSocket handlers registered');
    wsClient.connect().catch(() => {
      console.warn('WebSocket connection failed, continuing without real-time updates');
    });
    return () => {
      wsClient.off('notification', onNotification);
      wsClient.off('announcement', onAnnouncement);
      wsClient.off('system', onSystem);
    };
  }, [queryClient]);
}

export function useRealtimeTimetableUpdates() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!Cookies.get('access_token')) return;
    const wsClient = getWebSocketClient();
    const onNotification = (msg: WSMessage) => {
      const eventType = msg.event_type;
      console.log('📅 [useRealtimeTimetableUpdates] Message received:', { eventType, title: msg.title });
      if (typeof eventType !== 'string' || !eventType.startsWith('timetable.')) {
        console.log('   ↪️ Not a timetable event, skipping');
        return;
      }
      console.log('   ✅ Timetable event detected! Showing toast and refetching data');
      // Green toast for timetable updates (success)
      toast.success(msg.title || 'Timetable updated', { 
        description: msg.message || 'A change was published.'
      });
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    };
    wsClient.on('notification', onNotification);
    console.log('🔌 [useRealtimeTimetableUpdates] WebSocket handler registered');
    wsClient.connect().catch(() => {
      console.warn('WebSocket connection failed, continuing without real-time updates');
    });
    return () => {
      wsClient.off('notification', onNotification);
    };
  }, [queryClient]);
}
