/**
 * Assign Roles to User Dialog
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { AdminUser, RoleSummary } from '@/types/rbac';

interface AssignRolesDialogProps {
  open: boolean;
  user: AdminUser | null;
  roles: RoleSummary[];
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleCodes: string[], replace: boolean) => void;
}

export function AssignRolesDialog({
  open,
  user,
  roles,
  loading,
  onOpenChange,
  onSubmit,
}: AssignRolesDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [replace, setReplace] = useState(true);

  useEffect(() => {
    if (!open) return;
    setSelected(user?.roles ?? []);
    setReplace(true);
  }, [open, user]);

  const canSubmit = useMemo(() => selected.length > 0, [selected]);

  const toggleRole = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((r) => r !== code) : [...prev, code]
    );
  };

  const handleSubmit = () => onSubmit(selected, replace);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {user ? `${user.first_name} ${user.last_name}` : 'Select roles for user'}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selected.includes(role.code)}
                  onCheckedChange={() => toggleRole(role.code)}
                />
                {role.code}
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={replace} onCheckedChange={(v) => setReplace(Boolean(v))} />
            Replace existing roles
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? 'Saving...' : 'Assign Roles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
