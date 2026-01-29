/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Redirect to login if auth required but user not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && user) {
    const userRoles = user.roles.map((r) => r.code);
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on user's actual role
      const role = userRoles[0];
      const dashboardMap: Record<string, string> = {
        ADMIN: '/admin',
        STAFF: '/staff',
        LECTURER: '/lecturer',
        STUDENT: '/student',
      };
      return <Navigate to={dashboardMap[role] || '/dashboard'} replace />;
    }
  }

  return <>{children}</>;
}
