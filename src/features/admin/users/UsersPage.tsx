/**
 * Admin Users & RBAC Management
 */

import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from './UsersTable';
import { RolesPanel } from './RolesPanel';
import { PermissionsPanel } from './PermissionsPanel';

export function UsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage users, assign roles, and control permissions.
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:w-[420px]">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTable />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesPanel />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <PermissionsPanel />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
