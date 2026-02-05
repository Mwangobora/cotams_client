export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  roles: string[];
  profile_type?: string | null;
}

export interface RoleSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  permission_count: number;
  permissions?: PermissionSummary[];
}

export interface PermissionSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  module?: string;
  group?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
  role_codes: string[];
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export interface AssignRolesPayload {
  role_codes: string[];
  replace?: boolean;
}

export interface AssignPermissionsPayload {
  permission_codes: string[];
  replace?: boolean;
}
