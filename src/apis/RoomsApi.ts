/**
 * Rooms API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Room, RoomFormData, RoomFilters } from '@/types/rooms';

export class RoomsApi {
  /**
   * Get rooms with filters
   */
  async getRooms(filters: RoomFilters = {}): Promise<{ results: Room[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Room[]; count: number }>(
        `${API_ENDPOINTS.resources.rooms}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get room by ID
   */
  async getRoom(id: string): Promise<Room> {
    try {
      const response = await axios.get<Room>(
        API_ENDPOINTS.resources.roomDetail(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create new room
   */
  async createRoom(data: RoomFormData): Promise<Room> {
    try {
      const response = await axios.post<Room>(
        API_ENDPOINTS.resources.rooms,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Update room
   */
  async updateRoom(id: string, data: Partial<RoomFormData>): Promise<Room> {
    try {
      const response = await axios.patch<Room>(
        API_ENDPOINTS.resources.roomDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Delete room
   */
  async deleteRoom(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.resources.roomDetail(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const roomsApi = new RoomsApi();