# Notifications + Real-Time Updates (Frontend)

## What’s Completed
- WebSocket connection with JWT token query (`/ws/notifications/`).
- Real-time toast alerts for timetable changes, announcements, and system messages.
- Notifications inbox page with read/unread filtering.
- Mark single notification as read and mark all as read.
- Unread badge in the topbar (live count from backend).
- Timetable auto-refresh on timetable-related events.

## How It Works

### 1) WebSocket Connection
- Client connects to `VITE_WS_URL` or default `ws://localhost:8000/ws/notifications/`.
- JWT access token is appended as `?token=<access_token>`.
- Backend accepts and subscribes users to groups (user, stream, lecturer, admin, global).

Key file:
- `cotams_client/src/lib/ws.ts`

### 2) Real-Time Events → UI
WebSocket messages from backend:
- `notification`
- `announcement`
- `system`

Frontend behavior:
- `notification`: show toast + refresh notifications list; if event is timetable-related, timetable data is invalidated.
- `announcement`: show toast + refresh notifications list.
- `system`: show toast only.

Key file:
- `cotams_client/src/features/notifications/hooks.ts`
- `cotams_client/src/features/timetable/queries.ts`

### 3) Notifications Inbox (REST)
Inbox uses REST endpoints to list and update notifications.

Endpoints (frontend config):
- `GET /api/notifications/`
- `PATCH /api/notifications/{id}/read/`
- `POST /api/notifications/read-all/`
- `GET /api/notifications/unread-count/`
- `GET /api/notifications/stats/`

Key files:
- `cotams_client/src/apis/NotificationsApi.ts`
- `cotams_client/src/features/notifications/NotificationsPage.tsx`

### 4) Unread Badge
Topbar calls unread-count endpoint and displays badge if `> 0`.

Key file:
- `cotams_client/src/components/layout/topbar.tsx`

## Flow Summary
1. User logs in (JWT in cookies).
2. AppShell mounts and starts WebSocket listening.
3. Backend pushes real-time message.
4. Frontend shows toast, refreshes notifications, and refreshes timetable when needed.

## Configuration
Set in `.env`:
```
VITE_WS_URL=ws://localhost:8000/ws/notifications/
VITE_API_URL=http://localhost:8000/api
```

## Notes
- WebSocket is optional; REST still works if the connection fails.
- Notifications are persistent (REST inbox) and real-time (WebSocket).
