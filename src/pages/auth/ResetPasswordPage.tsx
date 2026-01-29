/**
 * Reset Password Page
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
