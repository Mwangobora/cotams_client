/**
 * Program Years API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { QueryParams } from '@/types/api.type';
import type { ProgramYear } from '@/types/programs';

export interface ProgramYearFormData {
  program: string;
  year_number: number;
  name?: string;
  is_active: boolean;
}

export interface ProgramYearFilters extends QueryParams {
  program?: string;
  is_active?: boolean;
}

export class ProgramYearsApi {
  async getProgramYears(filters: ProgramYearFilters = {}): Promise<{ results: ProgramYear[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: ProgramYear[]; count: number }>(
        `${API_ENDPOINTS.academics.programYears}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async createProgramYear(data: ProgramYearFormData): Promise<ProgramYear> {
    try {
      const response = await axios.post<ProgramYear>(
        API_ENDPOINTS.academics.programYears,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async updateProgramYear(id: string, data: Partial<ProgramYearFormData>): Promise<ProgramYear> {
    try {
      const response = await axios.patch<ProgramYear>(
        API_ENDPOINTS.academics.programYearDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async deleteProgramYear(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.academics.programYearDetail(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const programYearsApi = new ProgramYearsApi();
