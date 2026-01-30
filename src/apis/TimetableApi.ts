/**
 * Class-based Timetable API
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import type { Session, Stream, Room, Lecturer, TimetableFilters } from '@/features/timetable/types';

export class TimetableApi {
  private basePath = '/scheduling';

  /**
   * Get sessions with optional filters
   */
  async getSessions(filters: TimetableFilters = {}): Promise<Session[]> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Session[] }>(
        `${this.basePath}/sessions/?${params.toString()}`
      );
      return response.data.results || response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get session details by ID
   */
  async getSession(id: string): Promise<Session> {
    try {
      const response = await axios.get<Session>(`${this.basePath}/sessions/${id}/`);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get available streams (for admin filters)
   */
  async getStreams(): Promise<Stream[]> {
    try {
      const response = await axios.get<{ results: Stream[] }>('/academics/streams/');
      return response.data.results || response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get available rooms (for admin filters)
   */
  async getRooms(): Promise<Room[]> {
    try {
      const response = await axios.get<{ results: Room[] }>('/resources/rooms/');
      return response.data.results || response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get lecturers (for admin filters)
   */
  async getLecturers(): Promise<Lecturer[]> {
    try {
      const response = await axios.get<{ results: Lecturer[] }>('/accounts/users/?role=LECTURER');
      return response.data.results || response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

// Export singleton instance
export const timetableApi = new TimetableApi();