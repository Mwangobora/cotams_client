/**
 * Authentication feature types
 * All auth-related request/response types
 */

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  roles: Role[];
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  student_id?: string;
}

export interface RegisterStaffRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  staff_code?: string;
  secret_key?: string; // For staff registration verification
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
