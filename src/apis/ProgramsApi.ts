/**
 * Programs API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Program, ProgramFormData, ProgramFilters } from '@/types/programs';

export class ProgramsApi {
  /**
   * Get programs with filters
   */
  async getPrograms(filters: ProgramFilters = {}): Promise<{ results: Program[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Program[]; count: number }>(
        `${API_ENDPOINTS.academics.programs}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get program by ID
   */
  async getProgram(id: string): Promise<Program> {
    try {
      const response = await axios.get<Program>(
        API_ENDPOINTS.academics.programDetail(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create new program (if allowed)
   */
  async createProgram(data: ProgramFormData): Promise<Program> {
    try {
      const response = await axios.post<Program>(
        API_ENDPOINTS.academics.programs,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Update program (if allowed)
   */
  async updateProgram(id: string, data: Partial<ProgramFormData>): Promise<Program> {
    try {
      const response = await axios.patch<Program>(
        API_ENDPOINTS.academics.programDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const programsApi = new ProgramsApi();