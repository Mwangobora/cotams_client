/**
 * Admin users data & mutations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminUsersApi } from '@/apis/AdminUsersApi';
import { RbacApi } from '@/apis/RbacApi';
import type { AdminUser, CreateUserPayload, RoleSummary, UpdateUserPayload } from '@/types/rbac';

const toArray = <T,>(response: any): T[] =>
  Array.isArray(response) ? response : response?.results || [];

export function useAdminUsers() {
  const api = new AdminUsersApi();
  const rbacApi = new RbacApi();
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.listUsers(),
  });

  const { data: rolesResponse } = useQuery({
    queryKey: ['rbac', 'roles'],
    queryFn: () => rbacApi.listRoles(),
  });

  const users = toArray<AdminUser>(usersResponse);
  const roles = toArray<RoleSummary>(rolesResponse);

  const createUser = useMutation({
    mutationFn: (payload: CreateUserPayload) => api.createUser(payload),
    onSuccess: () => {
      toast.success('User created');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to create user'),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      api.updateUser(id, payload),
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update user'),
  });

  const deactivateUser = useMutation({
    mutationFn: (id: string) => api.deactivateUser(id),
    onSuccess: () => {
      toast.success('User deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to deactivate user'),
  });

  const assignRoles = useMutation({
    mutationFn: ({ id, roleCodes, replace }: { id: string; roleCodes: string[]; replace: boolean }) =>
      rbacApi.assignRolesToUser(id, { role_codes: roleCodes, replace }),
    onSuccess: () => {
      toast.success('Roles updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => toast.error(error.message || 'Failed to assign roles'),
  });

  return {
    users,
    roles,
    isLoading,
    createUser,
    updateUser,
    deactivateUser,
    assignRoles,
  };
}
