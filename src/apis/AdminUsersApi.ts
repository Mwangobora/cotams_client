import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { QueryParams } from '@/types/api.type';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '@/types/rbac';

export class AdminUsersApi {
  async listUsers(params: QueryParams = {}): Promise<{ results: AdminUser[]; count: number }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      const query = searchParams.toString();
      const response = await axios.get(
        `${API_ENDPOINTS.accounts.adminUsers}${query ? `?${query}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async createUser(data: CreateUserPayload): Promise<AdminUser> {
    try {
      const response = await axios.post<AdminUser>(API_ENDPOINTS.accounts.adminUsers, data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async updateUser(id: string, data: UpdateUserPayload): Promise<AdminUser> {
    try {
      const response = await axios.patch<AdminUser>(
        API_ENDPOINTS.accounts.adminUserDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async deactivateUser(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete<{ message: string }>(
        API_ENDPOINTS.accounts.adminUserDetail(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const adminUsersApi = new AdminUsersApi();
