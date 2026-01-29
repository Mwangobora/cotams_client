import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  roles?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Building2,
  FileText,
  Bell,
  BarChart3,
  Settings,
  User,
  ClipboardList,
  GraduationCap,
  BookMarked,
} from 'lucide-react';

// Admin navigation
export const adminNavigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Timetable Management',
    items: [
      { title: 'Timetable', href: '/timetable', icon: Calendar, permission: 'scheduling.session.read' },
      { title: 'Sessions', href: '/sessions', icon: ClipboardList, permission: 'scheduling.session.manage' },
      { title: 'Rooms', href: '/rooms', icon: Building2, permission: 'resources.room.manage' },
    ],
  },
  {
    title: 'Academic',
    items: [
      { title: 'Departments', href: '/departments', icon: Building2 },
      { title: 'Programs', href: '/programs', icon: BookOpen },
      { title: 'Submissions', href: '/submissions', icon: FileText, permission: 'academics.submission.review' },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
      { title: 'Audit Logs', href: '/audit', icon: BarChart3, permission: 'audit.log.read' },
    ],
  },
];

// Staff navigation
export const staffNavigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Academic Management',
    items: [
      { title: 'Modules', href: '/modules', icon: BookMarked, permission: 'academics.module.manage' },
      { title: 'Curriculum', href: '/curriculum', icon: BookOpen, permission: 'academics.curriculum.manage' },
      { title: 'Module Lecturers', href: '/module-lecturers', icon: Users },
    ],
  },
  {
    title: 'Submissions',
    items: [
      { title: 'My Submissions', href: '/submissions', icon: FileText, permission: 'academics.submission.create' },
    ],
  },
  {
    title: 'Other',
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
];

// Lecturer navigation
export const lecturerNavigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'My Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    title: 'Sessions',
    items: [
      { title: 'My Sessions', href: '/sessions', icon: ClipboardList },
    ],
  },
  {
    title: 'Other',
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
];

// Student navigation
export const studentNavigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Timetable', href: '/timetable', icon: Calendar },
    ],
  },
  {
    title: 'Sessions',
    items: [
      { title: 'Sessions List', href: '/sessions', icon: ClipboardList },
    ],
  },
  {
    title: 'Other',
    items: [
      { title: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
];

// Common navigation (available to all)
export const commonNavigation: NavItem[] = [
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Settings', href: '/settings', icon: Settings },
];
