/**
 * Authentication Layout
 * Centered layout for auth pages with branding
 */

import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/auth-bg.svg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-linear-to-br from-zinc-100/70 to-zinc-300/40 dark:from-zinc-950/70 dark:to-zinc-900/40" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-2xl space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tight">COTAMS</h1>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            College Timetable Management System
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card/95 p-8 shadow-lg backdrop-blur">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
      </motion.div>
    </div>
  );
}
