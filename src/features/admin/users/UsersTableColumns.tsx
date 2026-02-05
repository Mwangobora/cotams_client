/**
 * Users table column definitions
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/types/rbac';

export const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : '—';

interface ColumnActions {
  onEdit: (user: AdminUser) => void;
  onAssign: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  onActivate: (user: AdminUser) => void;
}

export function getUserColumns(actions: ColumnActions) {
  return [
    {
      header: 'User',
      accessor: (user: AdminUser) => (
        <div>
          <div className="font-medium">{user.full_name || `${user.first_name} ${user.last_name}`}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      ),
    },
    {
      header: 'Roles',
      accessor: (user: AdminUser) => (
        <div className="flex flex-wrap gap-2">
          {user.roles?.length ? (
            user.roles.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (user: AdminUser) => (
        <Badge variant={user.is_active ? 'default' : 'secondary'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Joined',
      className: 'hidden md:table-cell',
      accessor: (user: AdminUser) => <span className="hidden md:inline">{formatDate(user.date_joined)}</span>,
    },
    {
      header: 'Actions',
      accessor: (user: AdminUser) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => actions.onEdit(user)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => actions.onAssign(user)}>
            Roles
          </Button>
          {user.is_active ? (
            <Button size="sm" variant="destructive" onClick={() => actions.onDeactivate(user)}>
              Deactivate
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => actions.onActivate(user)}>
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];
}
