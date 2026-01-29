/**
 * Forgot Password Page
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
