import { 
  Home, 
  Calendar, 
  ClipboardList, 
  Users, 
  BookOpen, 
  DoorOpen,
  Bell,
  FileText,
  Settings,
  LayoutDashboard,
  type LucideIcon,
  GraduationCap,
  UserCheck,
  Send
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

// Admin Navigation
export const adminNavigation: NavGroup[] = [
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
      { title: 'Rooms', href: '/rooms', icon: DoorOpen },
      { title: 'Programs', href: '/programs', icon: GraduationCap },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Audit Logs', href: '/audit', icon: FileText },
    ],
  },
  {
    items: [
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Staff Navigation
export const staffNavigation: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Academic Management',
    items: [
      { title: 'Modules', href: '/modules', icon: BookOpen },
      { title: 'Curriculum', href: '/curriculum', icon: ClipboardList },
      { title: 'Module Lecturers', href: '/module-lecturers', icon: UserCheck },
    ],
  },
  {
    items: [
      { title: 'Submissions', href: '/submissions', icon: Send },
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Lecturer Navigation
export const lecturerNavigation: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'My Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// Student Navigation
export const studentNavigation: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function getNavigationForRole(roles: string[]): NavGroup[] {
  if (roles.includes('ADMIN')) return adminNavigation;
  if (roles.includes('STAFF')) return staffNavigation;
  if (roles.includes('LECTURER')) return lecturerNavigation;
  if (roles.includes('STUDENT')) return studentNavigation;
  return studentNavigation; // Default
}
