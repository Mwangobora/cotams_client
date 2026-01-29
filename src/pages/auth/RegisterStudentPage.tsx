/**
 * Student Registration Page
 */

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { RegisterStudentForm } from '@/features/auth/components/RegisterStudentForm';

export function RegisterStudentPage() {
  return (
    <AuthLayout
      title="Create Student Account"
      subtitle="Register to access your timetable and academic resources"
    >
      <RegisterStudentForm />
    </AuthLayout>
  );
}
