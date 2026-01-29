/**
 * Staff Registration Page
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterStaffForm } from '@/features/auth/components/RegisterStaffForm';

export function RegisterStaffPage() {
  return (
    <AuthLayout
      title="Create Staff Account"
      subtitle="Register to manage academic programs and timetables"
    >
      <RegisterStaffForm />
    </AuthLayout>
  );
}
