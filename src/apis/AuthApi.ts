/**
 * Class-based Authentication API
 * Handles all auth-related HTTP requests
 */

import axios from '@/services/api';
import Cookies from 'js-cookie';
import { normalizeAxiosError } from '@/features/auth/errors';
import type {
  LoginRequest,
  LoginResponse,
  RegisterStudentRequest,
  RegisterStaffRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  MeResponse,
} from '@/features/auth/types';
export class AuthApi {
  private basePath = '/auth';

  /**
   * Login user
   * Backend sets httpOnly cookies for session
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${this.basePath}/login/`, data);
      if (response.data?.access) {
        Cookies.set('access_token', response.data.access);
      }
      if (response.data?.refresh) {
        Cookies.set('refresh_token', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Logout user
   * Backend clears auth cookies
   */
  async logout(): Promise<void> {
    try {
      await axios.post(`${this.basePath}/logout/`);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get current authenticated user
   * Uses cookies sent automatically by browser
   */
  async me(): Promise<MeResponse> {
    try {
      const response = await axios.get<MeResponse>(`${this.basePath}/me/`);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Register new student
   */
  async registerStudent(data: RegisterStudentRequest): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(
        `${this.basePath}/register/student/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Register new staff
   * May require admin approval or secret key
   */
  async registerStaff(data: RegisterStaffRequest): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(
        `${this.basePath}/register/staff/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Request password reset
   * Sends reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const response = await axios.post<ForgotPasswordResponse>(
        `${this.basePath}/password/reset/request/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Confirm password reset with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await axios.post<ResetPasswordResponse>(
        `${this.basePath}/password/reset/confirm/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const response = await axios.post<ChangePasswordResponse>(
        `${this.basePath}/password/change/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

// Export singleton instance
export const authApi = new AuthApi();
