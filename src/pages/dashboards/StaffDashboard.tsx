/**
 * Staff Dashboard Page
 */

import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/layout-primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Layers, Users } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useStaffDashboardData } from './staff/useStaffDashboardData';

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
    : '—';

export function StaffDashboard() {
  const { user } = useAuthStore();
  const departmentId = user?.staff_profile?.department;
  const departmentName = user?.staff_profile?.department_name || 'Your Department';
  const { loading, programs, modules, departmentStreams, submissions, activityItems, counts } =
    useStaffDashboardData(departmentId);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <PageContainer>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {departmentName} overview and recent activity
            </p>
          </div>
          <Badge variant="secondary">{loading ? 'Loading…' : 'Live'}</Badge>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Programs', value: counts.programs, icon: Layers, accent: 'text-sky-500' },
            { label: 'Streams', value: counts.streams, icon: GraduationCap, accent: 'text-emerald-500' },
            { label: 'Modules', value: counts.modules, icon: BookOpen, accent: 'text-amber-500' },
            { label: 'Students', value: counts.students, icon: Users, accent: 'text-indigo-500' },
            { label: 'Lecturers', value: counts.lecturers, icon: GraduationCap, accent: 'text-rose-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted ${stat.accent}`}>
                  <stat.icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value || 0}</div>
                <p className="text-xs text-muted-foreground">Department totals</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {programs.slice(0, 6).map((program) => (
                  <div key={program.id} className="flex items-center justify-between">
                    <span className="truncate">{program.name}</span>
                    <Badge variant="outline">{program.code}</Badge>
                  </div>
                ))}
                {programs.length === 0 && <p className="text-muted-foreground">No programs found.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Streams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {departmentStreams.slice(0, 6).map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between">
                    <span className="truncate">{stream.name || 'Stream'}</span>
                    <Badge variant="outline">{stream.stream_code}</Badge>
                  </div>
                ))}
                {departmentStreams.length === 0 && <p className="text-muted-foreground">No streams found.</p>}
              </CardContent>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Module Names</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                {modules.slice(0, 8).map((module) => (
                  <div key={module.id} className="flex items-center justify-between">
                    <span className="truncate">{module.name}</span>
                    <span className="text-muted-foreground">{module.code}</span>
                  </div>
                ))}
                {modules.length === 0 && <p className="text-muted-foreground">No modules found.</p>}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {activityItems.slice(0, 6).map((item: any) => (
                  <div key={item.id || `${item.title}-${item.created_at}`} className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate">
                        {item.action || item.event || item.title || 'Activity'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.actor_name || item.submitted_by_name || 'Staff'} • {formatDate(item.created_at)}
                      </p>
                    </div>
                    <Badge variant="secondary">{item.status || item.level || 'Info'}</Badge>
                  </div>
                ))}
                {activityItems.length === 0 && <p className="text-muted-foreground">No recent activity.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {submissions.slice(0, 6).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between">
                    <span className="truncate">{submission.title}</span>
                    <span className="text-muted-foreground">{submission.status}</span>
                  </div>
                ))}
                {submissions.length === 0 && <p className="text-muted-foreground">No submissions yet.</p>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
