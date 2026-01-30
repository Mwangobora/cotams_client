/**
 * React Query mutations for authentication
 * Centralized mutation logic with consistent error handling
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/apis/AuthApi';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from './errors';
import type {
  LoginRequest,
  RegisterStudentRequest,
  RegisterStaffRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './types';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Login successful');

      // Redirect based on role - safely handle undefined roles
      const roles = response.user?.roles ?? [];
      const role = roles[0]?.code;
      const dashboardMap: Record<string, string> = {
        ADMIN: '/admin',
        STAFF: '/staff',
        LECTURER: '/lecturer',
        STUDENT: '/student',
      };
      navigate(dashboardMap[role] || '/student');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Logout failed');
    },
  });
}

export function useRegisterStudentMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterStudentRequest) => authApi.registerStudent(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Registration successful');
      navigate('/login');
    },
    onError: (error: ApiError) => {
      // Show first field error or general message
      const message = error.details?.[0]
        ? `${error.details[0].field}: ${error.details[0].message}`
        : error.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useRegisterStaffMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterStaffRequest) => authApi.registerStaff(data),
    onSuccess: (response) => {
      if (response.requires_approval) {
        toast.success('Registration submitted. Awaiting admin approval.');
      } else {
        toast.success(response.message || 'Registration successful');
      }
      navigate('/login');
    },
    onError: (error: ApiError) => {
      // Show first field error or general message
      const message = error.details?.[0]
        ? `${error.details[0].field}: ${error.details[0].message}`
        : error.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Password reset email sent');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

export function useResetPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Password reset successful');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Password reset failed');
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}
