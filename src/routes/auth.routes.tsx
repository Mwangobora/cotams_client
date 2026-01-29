/**
 * Authentication Routes
 */

import { Route } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterStudentPage } from '@/pages/auth/RegisterStudentPage';
import { RegisterStaffPage } from '@/pages/auth/RegisterStaffPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/auth/register/student" element={<RegisterStudentPage />} />
    <Route path="/auth/register/staff" element={<RegisterStaffPage />} />
    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
  </>
);
