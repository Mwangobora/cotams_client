/**
 * Module Lecturers API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type {
  ModuleLecturerAssignment,
  ModuleLecturerFilters,
  ModuleLecturerFormData,
} from '@/types/module-lecturers';

export class ModuleLecturersApi {
  /**
   * Get module lecturer assignments with filters
   */
  async getAssignments(
    filters: ModuleLecturerFilters = {}
  ): Promise<{ results: ModuleLecturerAssignment[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: ModuleLecturerAssignment[]; count: number }>(
        `${API_ENDPOINTS.academics.moduleLecturers}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create assignment
   */
  async createAssignment(data: ModuleLecturerFormData): Promise<ModuleLecturerAssignment> {
    try {
      const response = await axios.post<ModuleLecturerAssignment>(
        API_ENDPOINTS.academics.moduleLecturers,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Update assignment
   */
  async updateAssignment(
    id: string,
    data: Partial<ModuleLecturerFormData>
  ): Promise<ModuleLecturerAssignment> {
    try {
      const response = await axios.patch<ModuleLecturerAssignment>(
        `${API_ENDPOINTS.academics.moduleLecturers}${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINTS.academics.moduleLecturers}${id}/`);
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const moduleLecturersApi = new ModuleLecturersApi();
