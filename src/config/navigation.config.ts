import { 
  Calendar, 
  ClipboardList, 
  Users, 
  BookOpen, 
  DoorOpen,
  Building2,
  Bell,
  FileText,
  Settings,
  LayoutDashboard,
  type LucideIcon,
  GraduationCap,
  UserCheck,
  Send,
  User
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// Helper to prefix routes with role base path
function prefixRoutes(groups: NavGroup[], prefix: string): NavGroup[] {
  return groups.map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      href: `${prefix}${item.href === '/dashboard' ? '' : item.href}`,
    })),
  }));
}

// Admin Navigation (will be prefixed with /admin)
const adminNavItems: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Timetable Management',
    items: [
      { title: 'Timetable', href: '/timetable', icon: Calendar },
      { title: 'Sessions', href: '/sessions', icon: ClipboardList },
      { title: 'Submissions', href: '/submissions', icon: Send },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Departments', href: '/departments', icon: Building2 },
      { title: 'Rooms', href: '/rooms', icon: DoorOpen },
      { title: 'Programs', href: '/programs', icon: GraduationCap },
      { title: 'Lecturers', href: '/lecturers', icon: UserCheck },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Users', href: '/users', icon: Users },
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Audit Logs', href: '/audit', icon: FileText },
    ],
  },
  {
    items: [
      { title: 'Profile', href: '/profile', icon: User },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Staff Navigation (will be prefixed with /staff)
const staffNavItems: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Academic Management',
    items: [
      { title: 'Timetable', href: '/timetable', icon: Calendar },
      { title: 'Programs', href: '/programs', icon: GraduationCap },
      { title: 'Program Years', href: '/program-years', icon: ClipboardList },
      { title: 'Streams', href: '/streams', icon: Users },
      { title: 'Modules', href: '/modules', icon: BookOpen },
      { title: 'Lecturers', href: '/lecturers', icon: UserCheck },
      { title: 'Curriculum', href: '/curriculum', icon: ClipboardList },
      { title: 'Module Lecturers', href: '/module-lecturers', icon: UserCheck },
    ],
  },
  {
    items: [
      { title: 'Submissions', href: '/submissions', icon: Send },
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Profile', href: '/profile', icon: User },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Lecturer Navigation (will be prefixed with /lecturer)
const lecturerNavItems: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'My Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Profile', href: '/profile', icon: User },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Student Navigation (will be prefixed with /student)
const studentNavItems: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Profile', href: '/profile', icon: User },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function getNavigationForRole(roles: string[]): NavGroup[] {
  if (roles.includes('ADMIN')) return prefixRoutes(adminNavItems, '/admin');
  if (roles.includes('STAFF')) return prefixRoutes(staffNavItems, '/staff');
  if (roles.includes('LECTURER')) return prefixRoutes(lecturerNavItems, '/lecturer');
  if (roles.includes('STUDENT')) return prefixRoutes(studentNavItems, '/student');
  return prefixRoutes(studentNavItems, '/student'); // Default
}
