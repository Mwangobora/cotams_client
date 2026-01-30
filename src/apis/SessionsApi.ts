/**
 * Sessions API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Session, SessionFormData, SessionFilters, ClashError } from '@/types/sessions';

export class SessionsApi {
  /**
   * Get sessions with filters
   */
  async getSessions(filters: SessionFilters = {}): Promise<{ results: Session[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Session[]; count: number }>(
        `${API_ENDPOINTS.scheduling.sessions}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get session by ID
   */
  async getSession(id: string): Promise<Session> {
    try {
      const response = await axios.get<Session>(
        API_ENDPOINTS.scheduling.sessionDetail(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create new session
   */
  async createSession(data: SessionFormData): Promise<Session> {
    try {
      const response = await axios.post<Session>(
        API_ENDPOINTS.scheduling.sessions,
        data
      );
      return response.data;
    } catch (error) {
      const normalized = normalizeAxiosError(error);
      if (normalized.status === 409 && (normalized as any).data?.conflicts) {
        throw { type: 'CLASH_ERROR', conflicts: (normalized as any).data.conflicts } as ClashError;
      }
      throw normalized;
    }
  }

  /**
   * Update session
   */
  async updateSession(id: string, data: Partial<SessionFormData>): Promise<Session> {
    try {
      const response = await axios.patch<Session>(
        API_ENDPOINTS.scheduling.sessionDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      const normalized = normalizeAxiosError(error);
      if (normalized.status === 409 && (normalized as any).data?.conflicts) {
        throw { type: 'CLASH_ERROR', conflicts: (normalized as any).data.conflicts } as ClashError;
      }
      throw normalized;
    }
  }

  /**
   * Delete session
   */
  async deleteSession(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.scheduling.sessionDetail(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const sessionsApi = new SessionsApi();