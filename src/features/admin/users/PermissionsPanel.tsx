/**
 * Permissions List Panel
 */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RbacApi } from '@/apis/RbacApi';
import type { PermissionSummary } from '@/types/rbac';

const toArray = <T,>(response: any): T[] =>
  Array.isArray(response) ? response : response?.results || [];

export function PermissionsPanel() {
  const api = new RbacApi();
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['rbac', 'permissions'],
    queryFn: () => api.listPermissions(),
  });

  const permissions = toArray<PermissionSummary>(data);
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search permissions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="text-sm text-muted-foreground">{filtered.length} permissions</div>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">No permissions found.</div>
          )}
          {filtered.map((perm) => (
            <div key={perm.id} className="rounded-md border p-3">
              <div className="text-sm font-semibold">{perm.code}</div>
              <div className="text-xs text-muted-foreground">{perm.name}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {perm.module && <Badge variant="secondary">{perm.module}</Badge>}
                {perm.group && <Badge variant="outline">{perm.group}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
