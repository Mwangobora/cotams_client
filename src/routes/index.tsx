/**
 * Main Application Router
 * Handles all route definitions and protection
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from './ProtectedRoute';
import { authRoutes } from './auth.routes';
import { AdminDashboard } from '@/pages/dashboards/AdminDashboard';
import { StaffDashboard } from '@/pages/dashboards/StaffDashboard';
import { LecturerDashboard } from '@/pages/dashboards/LecturerDashboard';
import { StudentDashboard } from '@/pages/dashboards/StudentDashboard';
import { TimetablePage } from '@/features/timetable/components/TimetablePage';
import { SessionsPage } from '@/features/admin/sessions/SessionsPage';
import { RoomsPage } from '@/features/admin/rooms/RoomsPage';
import { ProgramsPage } from '@/features/admin/programs/ProgramsPage';
import { LecturersPage } from '@/features/admin/lecturers/LecturersPage';
import { SubmissionsPage } from '@/features/submissions/SubmissionsPage';
import { DepartmentsPage } from '@/features/admin/departments/DepartmentsPage';
import { UsersPage } from '@/features/admin/users/UsersPage';
import { ModulesPage } from '@/features/staff/modules/ModulesPage';
import { ModuleLecturersPage } from '@/features/staff/module-lecturers/ModuleLecturersPage';
import { LecturersPage as StaffLecturersPage } from '@/features/staff/lecturers/LecturersPage';
import { ProgramsPage as StaffProgramsPage } from '@/features/staff/programs/ProgramsPage';
import { ProgramYearsPage } from '@/features/staff/program-years/ProgramYearsPage';
import { StreamsPage } from '@/features/staff/streams/StreamsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      {authRoutes}

      {/* Protected routes with role-based access */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="sessions" element={<SessionsPage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="programs" element={<ProgramsPage />} />
                <Route path="lecturers" element={<LecturersPage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="submissions" element={<SubmissionsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <AppShell>
              <Routes>
                <Route index element={<StaffDashboard />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="modules" element={<ModulesPage />} />
                <Route path="programs" element={<StaffProgramsPage />} />
                <Route path="program-years" element={<ProgramYearsPage />} />
                <Route path="streams" element={<StreamsPage />} />
                <Route path="lecturers" element={<StaffLecturersPage />} />
                <Route path="module-lecturers" element={<ModuleLecturersPage />} />
                <Route path="submissions" element={<SubmissionsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/staff" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lecturer/*"
        element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <AppShell>
              <Routes>
                <Route index element={<LecturerDashboard />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/lecturer" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppShell>
              <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Fallback routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/student" replace />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
