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
    modules: '/academics/modules/',
    moduleDetail: (id: string) => `/academics/modules/${id}/`,
    curriculum: '/academics/curriculum/',
    programs: '/academics/programs/',
    programDetail: (id: string) => `/academics/programs/${id}/`,
    programYears: '/academics/program-years/',
    programYearDetail: (id: string) => `/academics/program-years/${id}/`,
    streams: '/academics/streams/',
    streamDetail: (id: string) => `/academics/streams/${id}/`,
    moduleLecturers: '/academics/module-lecturers/',
    submissions: '/academics/submissions/',
    submissionDetail: (id: string) => `/academics/submissions/${id}/`,
    submissionSubmit: (id: string) => `/academics/submissions/${id}/submit/`,
    submissionApprove: (id: string) => `/academics/submissions/${id}/approve/`,
    submissionReject: (id: string) => `/academics/submissions/${id}/reject/`,
  },

  // Resources
  resources: {
    rooms: '/resources/rooms/',
    roomDetail: (id: string) => `/resources/rooms/${id}/`,
    buildings: '/resources/buildings/',
    equipment: '/resources/equipment/',
  },

  // Institutions
  institutions: {
    departments: '/institutions/departments/',
    departmentDetail: (id: string) => `/institutions/departments/${id}/`,
    departmentLecturers: (id: string) => `/institutions/departments/${id}/lecturers/`,
  },

  // Accounts/Users
  accounts: {
    users: '/accounts/users/',
    userDetail: (id: string) => `/accounts/users/${id}/`,
    lecturers: '/accounts/users/?role=LECTURER',
    staff: '/accounts/users/?role=STAFF',
    students: '/accounts/users/?role=STUDENT',
    profile: '/accounts/profile/',
    adminUsers: '/admin/users/',
    adminUserDetail: (id: string) => `/admin/users/${id}/`,
  },

  // RBAC
  rbac: {
    roles: '/rbac/roles/',
    permissions: '/rbac/permissions/',
    rolePermissions: (id: string) => `/rbac/roles/${id}/permissions/`,
    userRoles: (id: string) => `/rbac/users/${id}/roles/`,
  },

  // Notifications
  notifications: {
    list: '/notifications/',
    detail: (id: string) => `/notifications/${id}/`,
    markRead: (id: string) => `/notifications/${id}/read/`,
    markAllRead: '/notifications/read-all/',
    unreadCount: '/notifications/unread-count/',
    stats: '/notifications/stats/',
  },

  // Audit
  audit: {
    logs: '/audit/logs/',
    logDetail: (id: string) => `/audit/logs/${id}/`,
  },
} as const;
