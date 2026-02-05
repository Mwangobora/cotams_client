# Real-Time Timetable Notifications

## Overview
Timetable changes trigger automatic notifications for students and lecturers without requiring a page refresh.

## How It Works
- WebSocket messages with `event_type` starting with `timetable.` are treated as timetable updates.
- A toast is shown immediately, and timetable/notification queries are invalidated for fresh data.
- The listener is mounted globally in the app shell so it works on all pages.

## Files
- `cotams_client/src/features/notifications/hooks.ts`
- `cotams_client/src/components/layout/app-shell.tsx`
- `cotams_client/src/features/notifications/NotificationsPage.tsx`
