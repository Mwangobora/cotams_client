import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type {
  RoleSummary,
  PermissionSummary,
  AssignPermissionsPayload,
  AssignRolesPayload,
} from '@/types/rbac';

export class RbacApi {
  async listRoles(): Promise<{ results: RoleSummary[]; count: number } | RoleSummary[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.rbac.roles);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async listPermissions(): Promise<{ results: PermissionSummary[]; count: number } | PermissionSummary[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.rbac.permissions);
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
