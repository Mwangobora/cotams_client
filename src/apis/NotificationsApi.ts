import axios from '@/services/api';
import { API_ENDPOINTS } from '@/config/endpoints';
import { normalizeAxiosError } from '@/features/auth/errors';
import type { Notification, NotificationStats } from '@/types/notification.type';

export interface NotificationFilters {
  is_read?: boolean;
  event_type?: string;
  page?: number;
}

export class NotificationsApi {
  async list(filters: NotificationFilters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      const url = `${API_ENDPOINTS.notifications.list}?${params.toString()}`;
      const response = await axios.get(url);
      const data = response.data;
      if (Array.isArray(data)) return { results: data as Notification[], count: data.length };
      return { results: data?.results || [], count: data?.count || 0 };
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await axios.patch(API_ENDPOINTS.notifications.markRead(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async markAllRead(): Promise<number> {
    try {
      const response = await axios.post(API_ENDPOINTS.notifications.markAllRead);
      return response.data?.updated_count || 0;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async unreadCount(): Promise<number> {
    try {
      const response = await axios.get(API_ENDPOINTS.notifications.unreadCount);
      return response.data?.unread || response.data?.count || 0;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async stats(): Promise<NotificationStats> {
    try {
      const response = await axios.get<NotificationStats>(API_ENDPOINTS.notifications.stats);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const notificationsApi = new NotificationsApi();
