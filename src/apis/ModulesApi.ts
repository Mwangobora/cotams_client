/**
 * Modules API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Module, ModuleFilters } from '@/types/modules';

export class ModulesApi {
  /**
   * Get modules with filters
   */
  async getModules(filters: ModuleFilters = {}): Promise<{ results: Module[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Module[]; count: number }>(
        `${API_ENDPOINTS.academics.modules}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const modulesApi = new ModulesApi();
