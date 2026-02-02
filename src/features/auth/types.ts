/**
 * Authentication feature types
 * All auth-related request/response types
 */

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface StaffProfile {
  id: string;
  employee_id?: string;
  department: string;
  department_name?: string;
  title?: string;
  office_location?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface LecturerProfile {
  id: string;
  employee_id?: string;
  department: string;
  department_name?: string;
  title?: string;
  specialization?: string[] | string;
  office_location?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  roles: Role[];
  staff_profile?: StaffProfile | null;
  lecturer_profile?: LecturerProfile | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  registration_number: string;
}

export interface RegisterStaffRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department?: string;
  title?: string;
  office_location?: string;
  phone_number?: string;
}

export interface RegisterResponse {
  user?: User;
  message: string;
  requires_approval?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirm: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface MeResponse {
  user: User;
}
