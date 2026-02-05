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

  /**
   * Create module
   */
  async createModule(data: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<Module> {
    try {
      const response = await axios.post<Module>(API_ENDPOINTS.academics.modules, data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Update module
   */
  async updateModule(
    id: string,
    data: Partial<Omit<Module, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Module> {
    try {
      const response = await axios.patch<Module>(API_ENDPOINTS.academics.moduleDetail(id), data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async deleteModule(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.academics.moduleDetail(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const modulesApi = new ModulesApi();
