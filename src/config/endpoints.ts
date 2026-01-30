/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for easy maintenance
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login/',
    logout: '/auth/logout/',
    refresh: '/auth/token/refresh/',
    me: '/auth/me/',
    forgotPassword: '/auth/password/reset/',
    resetPassword: '/auth/password/reset/confirm/',
  },

  // Scheduling
  scheduling: {
    sessions: '/scheduling/sessions/',
    sessionDetail: (id: string) => `/scheduling/sessions/${id}/`,
    clashCheck: '/scheduling/clash-check/',
    bulkCreate: '/scheduling/sessions/bulk-create/',
  },

  // Academics
  academics: {
    streams: '/academics/streams/',
    streamDetail: (id: string) => `/academics/streams/${id}/`,
    modules: '/academics/modules/',
    moduleDetail: (id: string) => `/academics/modules/${id}/`,
    curriculum: '/academics/curriculum/',
    programs: '/academics/programs/',
    programDetail: (id: string) => `/academics/programs/${id}/`,
  },

  // Resources
  resources: {
    rooms: '/resources/rooms/',
    roomDetail: (id: string) => `/resources/rooms/${id}/`,
    buildings: '/resources/buildings/',
    equipment: '/resources/equipment/',
  },

  // Accounts/Users
  accounts: {
    users: '/accounts/users/',
    userDetail: (id: string) => `/accounts/users/${id}/`,
    lecturers: '/accounts/users/?role=LECTURER',
    staff: '/accounts/users/?role=STAFF',
    students: '/accounts/users/?role=STUDENT',
    profile: '/accounts/profile/',
  },

  // Notifications
  notifications: {
    list: '/notifications/',
    detail: (id: string) => `/notifications/${id}/`,
    markRead: (id: string) => `/notifications/${id}/mark-read/`,
    markAllRead: '/notifications/mark-all-read/',
  },

  // Audit
  audit: {
    logs: '/audit/logs/',
    logDetail: (id: string) => `/audit/logs/${id}/`,
  },
} as const;