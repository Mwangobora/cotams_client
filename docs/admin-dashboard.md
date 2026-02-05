# Admin Dashboard

## Purpose
The Admin Dashboard provides a live, role-specific overview of departments, users, sessions, and room usage. It is designed to be responsive, dark-theme friendly, and animated with Framer Motion.

## Data Sources
- Departments: `DepartmentsApi.getDepartments()`
- Lecturers: `LecturersApi.getLecturers()`
- Courses (Modules): `ModulesApi.getModules()`
- Sessions: `SessionsApi.getSessions()`
- Rooms: `RoomsApi.getRooms()`
- Users total: `GET /accounts/users/` via `axios`

## Sections
- **Stats Grid**: Total users, departments, lecturers, courses, sessions, and rooms.
- **Departments Overview**: Lecturers and courses per department.
- **Today’s Sessions**: List of sessions scheduled for the current day.
- **Room Usage**: Live snapshot of in-use vs available rooms.

## Real-Time Room Usage
Room usage is computed client-side:
- Current day is derived from local time.
- Rooms are “in use” when `now` falls between a session’s `start_time` and `end_time`.
- A timer refreshes the “live” snapshot once per minute.

## Files
- `cotams_client/src/pages/dashboards/AdminDashboard.tsx`
- `cotams_client/src/pages/dashboards/admin/useAdminDashboardData.ts`
- `cotams_client/src/pages/dashboards/admin/AdminStatsGrid.tsx`
- `cotams_client/src/pages/dashboards/admin/AdminDepartmentTable.tsx`
- `cotams_client/src/pages/dashboards/admin/AdminSessionsPanel.tsx`
- `cotams_client/src/pages/dashboards/admin/AdminRoomsPanel.tsx`
