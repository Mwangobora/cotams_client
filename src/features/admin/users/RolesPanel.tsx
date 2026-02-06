/**
 * Roles Management Panel
 */

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { RbacApi } from '@/apis/RbacApi';
import { RolePermissionsDialog } from './RolePermissionsDialog';
import type { PermissionSummary, RoleSummary } from '@/types/rbac';

const toArray = <T,>(response: any): T[] =>
  Array.isArray(response) ? response : response?.results || [];

export function RolesPanel() {
  const api = new RbacApi();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<RoleSummary | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: rolesResponse, isLoading } = useQuery({
    queryKey: ['rbac', 'roles', page, pageSize],
    queryFn: () => api.listRoles({ page, page_size: pageSize }),
    keepPreviousData: true,
  });

  const { data: permissionsResponse } = useQuery({
    queryKey: ['rbac', 'permissions'],
    queryFn: () => api.listPermissions(),
  });

  const roles = toArray<RoleSummary>(rolesResponse);
  const totalRoles = Array.isArray(rolesResponse) ? rolesResponse.length : rolesResponse?.count || 0;
  const permissions = toArray<PermissionSummary>(permissionsResponse);

  const assignMutation = useMutation({
    mutationFn: ({ roleId, codes, replace }: { roleId: string; codes: string[]; replace: boolean }) =>
      api.assignPermissionsToRole(roleId, { permission_codes: codes, replace }),
    onSuccess: () => {
      toast.success('Permissions updated');
      queryClient.invalidateQueries({ queryKey: ['rbac', 'roles'] });
      setDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update role'),
  });

  const openPermissions = useCallback((role: RoleSummary) => {
    setSelectedRole(role);
    setDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      { header: 'Role', accessor: 'code' as keyof RoleSummary },
      { header: 'Name', accessor: 'name' as keyof RoleSummary },
      {
        header: 'Permissions',
        accessor: (role: RoleSummary) => `${role.permission_count ?? 0}`,
      },
      {
        header: 'Status',
        accessor: (role: RoleSummary) => (
          <Badge variant={role.is_active ? 'default' : 'secondary'}>
            {role.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        header: 'Actions',
        accessor: (role: RoleSummary) => (
          <Button size="sm" variant="outline" onClick={() => openPermissions(role)}>
            Manage Permissions
          </Button>
        ),
      },
    ],
    [openPermissions]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <DataTable
        title="Roles"
        columns={columns}
        data={roles}
        loading={isLoading}
        actions={false}
        emptyMessage="No roles found"
        pagination={{
          page,
          pageSize,
          total: totalRoles,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <RolePermissionsDialog
        open={dialogOpen}
        role={selectedRole}
        permissions={permissions}
        loading={assignMutation.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={(codes, replace) =>
          selectedRole && assignMutation.mutate({ roleId: selectedRole.id, codes, replace })
        }
      />
    </motion.div>
  );
}
