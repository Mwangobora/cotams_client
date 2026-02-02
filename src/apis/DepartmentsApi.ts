/**
 * Departments API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Department, DepartmentFilters, DepartmentFormData } from '@/types/departments';

export class DepartmentsApi {
  /**
   * Get departments with filters
   */
  async getDepartments(
    filters: DepartmentFilters = {}
  ): Promise<{ results: Department[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Department[]; count: number }>(
        `${API_ENDPOINTS.institutions.departments}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create department
   */
  async createDepartment(data: DepartmentFormData): Promise<Department> {
    try {
      const response = await axios.post<Department>(
        API_ENDPOINTS.institutions.departments,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Update department
   */
  async updateDepartment(id: string, data: Partial<DepartmentFormData>): Promise<Department> {
    try {
      const response = await axios.patch<Department>(
        API_ENDPOINTS.institutions.departmentDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.institutions.departmentDetail(id));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const departmentsApi = new DepartmentsApi();
