/**
 * Authentication Layout
 * Centered layout for auth pages with branding
 */

import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">COTAMS</h1>
          <p className="text-sm text-muted-foreground">
            College Timetable Management System
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border-2 border-border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
