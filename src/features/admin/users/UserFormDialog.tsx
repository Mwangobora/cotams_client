/** Create/Edit User Dialog */
import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdminUser, CreateUserPayload, UpdateUserPayload, RoleSummary } from '@/types/rbac';

interface UserFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  roles: RoleSummary[];
  initial?: AdminUser | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => void;
}
export function UserFormDialog({
  open,
  mode,
  roles,
  initial,
  loading,
  onOpenChange,
  onSubmit,
}: UserFormDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setEmail(initial?.email ?? '');
    setPassword('');
    setFirstName(initial?.first_name ?? '');
    setLastName(initial?.last_name ?? '');
    setIsActive(initial?.is_active ?? true);
    setSelectedRoles(initial?.roles ?? []);
  }, [open, initial]);

  const canSubmit = useMemo(() => {
    if (mode === 'edit') return Boolean(firstName.trim() || lastName.trim());
    return Boolean(
      email.trim() &&
        password.trim() &&
        firstName.trim() &&
        lastName.trim() &&
        selectedRoles.length
    );
  }, [mode, email, password, firstName, lastName, selectedRoles]);

  const toggleRole = (code: string) => {
    setSelectedRoles((prev) =>
      prev.includes(code) ? prev.filter((r) => r !== code) : [...prev, code]
    );
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      onSubmit({
        email: email.trim().toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        is_active: isActive,
        role_codes: selectedRoles,
      });
      return;
    }

    onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create User' : 'Edit User'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mode === 'edit'}
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {mode === 'create' && (
            <div className="space-y-2">
              <Label>Assign roles</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedRoles.includes(role.code)}
                      onCheckedChange={() => toggleRole(role.code)}
                    />
                    {role.code}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
            Active account
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
