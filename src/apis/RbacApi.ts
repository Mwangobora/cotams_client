import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { QueryParams } from '@/types/api.type';
import type {
  RoleSummary,
  PermissionSummary,
  AssignPermissionsPayload,
  AssignRolesPayload,
} from '@/types/rbac';

export class RbacApi {
  async listRoles(params: QueryParams = {}): Promise<{ results: RoleSummary[]; count: number }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      const query = searchParams.toString();
      const response = await axios.get(`${API_ENDPOINTS.rbac.roles}${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async listPermissions(params: QueryParams = {}): Promise<{ results: PermissionSummary[]; count: number }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
      const query = searchParams.toString();
      const response = await axios.get(
        `${API_ENDPOINTS.rbac.permissions}${query ? `?${query}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async assignPermissionsToRole(roleId: string, data: AssignPermissionsPayload) {
    try {
      const response = await axios.post(API_ENDPOINTS.rbac.rolePermissions(roleId), data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async assignRolesToUser(userId: string, data: AssignRolesPayload) {
    try {
      const response = await axios.post(API_ENDPOINTS.rbac.userRoles(userId), data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const rbacApi = new RbacApi();
