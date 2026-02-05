/**
 * Assign Permissions to Role Dialog
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PermissionSummary, RoleSummary } from '@/types/rbac';

interface RolePermissionsDialogProps {
  open: boolean;
  role: RoleSummary | null;
  permissions: PermissionSummary[];
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (permissionCodes: string[], replace: boolean) => void;
}

export function RolePermissionsDialog({
  open,
  role,
  permissions,
  loading,
  onOpenChange,
  onSubmit,
}: RolePermissionsDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [replace, setReplace] = useState(true);
  const [query, setQuery] = useState('');
  const canSubmit = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    setSelected((role?.permissions ?? []).map((perm) => perm.code));
    setReplace(true);
    setQuery('');
  }, [open, role]);

  const filtered = useMemo(() => {
    if (!query.trim()) return permissions;
    const q = query.toLowerCase();
    return permissions.filter(
      (perm) =>
        perm.code.toLowerCase().includes(q) ||
        perm.name.toLowerCase().includes(q) ||
        perm.module?.toLowerCase().includes(q)
    );
  }, [permissions, query]);

  const togglePerm = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Role Permissions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {role ? `${role.code} - ${role.name}` : 'Select permissions for role'}
          </div>

          <div className="space-y-2">
            <Label>Search permissions</Label>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="max-h-64 overflow-auto rounded-md border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {filtered.map((perm) => (
                <label key={perm.id} className="flex items-start gap-2 text-sm">
                  <Checkbox
                    checked={selected.includes(perm.code)}
                    onCheckedChange={() => togglePerm(perm.code)}
                  />
                  <span>
                    <span className="font-medium">{perm.code}</span>
                    <span className="block text-xs text-muted-foreground">{perm.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={replace} onCheckedChange={(v) => setReplace(Boolean(v))} />
            Replace existing permissions
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(selected, replace)} disabled={!canSubmit || loading}>
            {loading ? 'Saving...' : 'Save Permissions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
