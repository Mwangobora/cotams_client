# COTAMS Frontend

**College Real-Time Timetable Management System** - Modern React frontend with TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## 🚀 Tech Stack

- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui
- **State Management**: Zustand (with persistence)
- **Routing**: React Router DOM v7
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## ✨ Features

- 🎨 **Beautiful UI** - Built with shadcn/ui components
- 🌓 **Dark Mode** - System-aware theme with manual toggle
- 📱 **Responsive** - Mobile-first design with adaptive layouts
- 🔐 **Authentication** - JWT-based auth with auto token refresh
- 🎭 **Role-Based Navigation** - Dynamic navigation based on user roles (Admin, Staff, Lecturer, Student)
- ⚡ **Fast** - Optimized with Vite and React Query
- 🎯 **Type Safe** - Full TypeScript coverage
- 🔄 **Real-time** - WebSocket support ready (notifications)

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx          # Main layout shell
│   │   ├── sidebar.tsx            # Desktop sidebar navigation
│   │   ├── mobile-sidebar.tsx    # Mobile drawer navigation
│   │   └── topbar.tsx             # Top navigation bar
│   ├── ui/                        # shadcn/ui components
│   └── theme-toggle.tsx           # Theme switcher
├── config/
│   └── navigation.config.ts       # Role-based navigation
├── providers/
│   ├── theme-provider.tsx         # Theme context
│   └── query-provider.tsx         # React Query client
├── services/
│   └── api.ts                     # Axios instance with interceptors
├── store/
│   └── auth.store.ts              # Zustand auth state
├── types/
│   ├── auth.type.ts               # Authentication types
│   ├── institution.type.ts        # Institution/Department types
│   ├── academic.type.ts           # Program/Module/Curriculum types
│   ├── resource.type.ts           # Room/Resource types
│   ├── schedule.type.ts           # Timetable/Session types
│   ├── notification.type.ts       # Notification types
│   ├── api.type.ts                # API response types
│   └── index.ts                   # Type re-exports
├── lib/
│   └── utils.ts                   # Utility functions
├── main.tsx                       # Application entry with routing
└── index.css                      # Global styles & theme
\`\`\`

## 🎨 Theme Configuration

Brand colors configured in \`src/index.css\`:
- **Primary**: \`#0E21A0\` (Deep Blue)
- **Dark Background**: \`#30364F\` (Navy Gray)
- Light/Dark mode support with CSS variables

## 🔐 Authentication Flow

1. User logs in → JWT access & refresh tokens stored in cookies
2. API requests automatically include access token
3. On 401 error → Attempt token refresh
4. On refresh failure → Redirect to login
5. Zustand store persists auth state

## 🧭 Navigation System

Role-based navigation configured in \`src/config/navigation.config.ts\`:

- **Admin**: Full access (Dashboard, Timetable, Sessions, Rooms, Programs, Notifications, Audit, Settings)
- **Staff**: Academic management (Modules, Curriculum, Module Lecturers, Submissions)
- **Lecturer**: Personal view (Dashboard, My Timetable, Notifications)
- **Student**: Basic access (Dashboard, Timetable, Notifications)

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Backend API running on \`http://localhost:8000\` (or configure in \`.env\`)

### Installation

\`\`\`bash
# Install dependencies
npm install
\`\`\`

### Environment Variables

Create \`.env\` file:

\`\`\`env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=COTAMS
\`\`\`

### Available Scripts

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
\`\`\`

## 📦 Installed shadcn/ui Components

- Button, Card, Input, Label
- Form, Dialog, Dropdown Menu
- Select, Textarea, Table
- Badge, Avatar, Sonner (Toast)
- Skeleton, Separator, Tabs
- Alert, Sheet

## 🔌 API Integration

API client configured in \`src/services/api.ts\`:

\`\`\`typescript
import api from '@/services/api';

// Example usage
const response = await api.get('/timetable/sessions/');
const data = await api.post('/auth/login/', credentials);
\`\`\`

Features:
- Automatic JWT token injection
- Token refresh on 401
- Request/response interceptors
- TypeScript types for all endpoints

## 📋 Type System

All types follow naming convention: \`*.type.ts\`

Example:
\`\`\`typescript
import type { User, LoginCredentials } from '@/types/auth.type';
import type { Department } from '@/types/institution.type';
import type { TimetableSession } from '@/types/schedule.type';
\`\`\`

## 🎯 Next Steps

1. ✅ **Layout & Setup** - Complete
2. 🚧 **Authentication** - Login, Forgot Password, Reset Password pages
3. 📅 **Timetable Module** - Grid view, session management, clash detection
4. 🔔 **Notifications** - WebSocket integration, real-time updates
5. 📊 **Dashboard** - Role-based widgets and statistics
6. 👥 **User Management** - Admin panel for users/roles
7. 📚 **Academic Management** - Programs, modules, curriculum
8. 🏢 **Resource Management** - Rooms, facilities

## 🤝 Backend Integration

Backend API: \`http://localhost:8000/api\`

### Key Endpoints

- \`POST /auth/login/\` - User login
- \`POST /auth/token/refresh/\` - Refresh access token
- \`GET /timetable/sessions/\` - Get timetable sessions
- \`GET /notifications/\` - Get notifications
- \`GET /institutions/departments/\` - Get departments

Full API documentation: See backend \`API_REFERENCE.md\`

## 📱 Responsive Design

- **Mobile** (<640px): Drawer navigation, stacked layout
- **Tablet** (640px-1024px): Optimized spacing
- **Desktop** (>1024px): Fixed sidebar, full layout

## 🎭 Layout Components

### AppShell
Main application shell with sidebar and topbar.

\`\`\`typescript
import { AppShell } from '@/components/layout/app-shell';

<AppShell>
  {/* Your page content */}
</AppShell>
\`\`\`

### Layout Primitives

\`\`\`typescript
import { PageContainer, Section, Grid } from '@/components/layout/layout-primitives';

<PageContainer>
  <Section>
    <Grid cols={3}>
      {/* Grid items */}
    </Grid>
  </Section>
</PageContainer>
\`\`\`

## 🐛 Development Notes

- All navigation is role-based and automatically configured
- Theme persists across sessions in localStorage
- Auth tokens stored in httpOnly cookies (secure)
- TypeScript strict mode enabled
- Path aliases configured (\`@/*\` → \`src/*\`)

## 📄 License

MIT

## 👥 Team

COTAMS Development Team

---

**Status**: ✅ Foundation Complete | 🚧 Authentication Phase Next
