/**
 * Users Table with Role Assignment
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { UserFormDialog } from './UserFormDialog';
import { AssignRolesDialog } from './AssignRolesDialog';
import { useAdminUsers } from './useAdminUsers';
import { getUserColumns } from './UsersTableColumns';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '@/types/rbac';

export function UsersTable() {
  const {
    users,
    roles,
    isLoading,
    createUser,
    updateUser,
    deactivateUser,
    assignRoles,
  } = useAdminUsers();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(q) ||
        user.first_name.toLowerCase().includes(q) ||
        user.last_name.toLowerCase().includes(q)
    );
  }, [users, query]);

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: (user) => {
          setFormMode('edit');
          setSelectedUser(user);
          setFormOpen(true);
        },
        onAssign: (user) => {
          setSelectedUser(user);
          setAssignOpen(true);
        },
        onDeactivate: (user) => {
          setSelectedUser(user);
          setConfirmOpen(true);
        },
        onActivate: (user) => updateUser.mutate({ id: user.id, payload: { is_active: true } }),
      }),
    [updateUser]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="text-sm text-muted-foreground">{filteredUsers.length} users</div>
      </div>

      <DataTable
        title="Users"
        columns={columns}
        data={filteredUsers}
        loading={isLoading}
        onAdd={() => {
          setFormMode('create');
          setSelectedUser(null);
          setFormOpen(true);
        }}
        addButtonText="Add User"
        actions={false}
        emptyMessage="No users found"
      />

      <UserFormDialog
        open={formOpen}
        mode={formMode}
        roles={roles}
        initial={selectedUser}
        loading={createUser.isPending || updateUser.isPending}
        onOpenChange={setFormOpen}
        onSubmit={(payload) => {
          if (formMode === 'create') {
            createUser.mutate(payload as CreateUserPayload);
          } else if (selectedUser) {
            updateUser.mutate({ id: selectedUser.id, payload: payload as UpdateUserPayload });
          }
        }}
      />

      <AssignRolesDialog
        open={assignOpen}
        user={selectedUser}
        roles={roles}
        loading={assignRoles.isPending}
        onOpenChange={setAssignOpen}
        onSubmit={(roleCodes, replace) =>
          selectedUser && assignRoles.mutate({ id: selectedUser.id, roleCodes, replace })
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deactivate User"
        description="This user will lose access to the system. You can reactivate later."
        confirmText="Deactivate"
        variant="destructive"
        loading={deactivateUser.isPending}
        onConfirm={() => selectedUser && deactivateUser.mutate(selectedUser.id)}
      />
    </motion.div>
  );
}
