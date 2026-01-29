export interface Notification {
  id: string;
  event_type: string;
  title: string;
  message: string;
  payload?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<string, number>;
}
