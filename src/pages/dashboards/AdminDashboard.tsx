/**
 * Admin Dashboard Page
 */

import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/layout-primitives';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Building2, GraduationCap, BookOpen, CalendarClock, DoorOpen } from 'lucide-react';
import { AdminStatsGrid } from './admin/AdminStatsGrid';
import { AdminDepartmentTable } from './admin/AdminDepartmentTable';
import { AdminRoomsPanel } from './admin/AdminRoomsPanel';
import { AdminSessionsPanel } from './admin/AdminSessionsPanel';
import { useAdminDashboardData } from './admin/useAdminDashboardData';

export function AdminDashboard() {
  const { loading, totalUsers, totals, departmentStats, roomsUsage, todaySessions, now } =
    useAdminDashboardData();

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers || '—',
      helper: 'System accounts',
      icon: Users,
      accent: 'text-emerald-500/80',
    },
    {
      label: 'Departments',
      value: totals.departments || '—',
      helper: 'Active departments',
      icon: Building2,
      accent: 'text-sky-500/80',
    },
    {
      label: 'Lecturers',
      value: totals.lecturers || '—',
      helper: 'Total lecturers',
      icon: GraduationCap,
      accent: 'text-amber-500/80',
    },
    {
      label: 'Courses',
      value: totals.courses || '—',
      helper: 'Active modules',
      icon: BookOpen,
      accent: 'text-purple-500/80',
    },
    {
      label: 'Sessions',
      value: totals.sessions || '—',
      helper: 'All scheduled sessions',
      icon: CalendarClock,
      accent: 'text-indigo-500/80',
    },
    {
      label: 'Rooms',
      value: totals.rooms || '—',
      helper: 'Total rooms tracked',
      icon: DoorOpen,
      accent: 'text-rose-500/80',
    },
  ];

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Live overview of departments, sessions, rooms, and system usage.
          </p>
        </div>

        {loading && (
          <Alert>
            <AlertDescription>Loading dashboard data...</AlertDescription>
          </Alert>
        )}

        <AdminStatsGrid stats={stats} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <AdminDepartmentTable items={departmentStats} />
          <AdminSessionsPanel sessions={todaySessions} />
        </div>

        <AdminRoomsPanel used={roomsUsage.used} free={roomsUsage.free} now={now} />
      </motion.div>
    </PageContainer>
  );
}
