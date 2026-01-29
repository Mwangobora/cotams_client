import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { AppShell } from '@/components/layout/app-shell';
import { PageContainer } from '@/components/layout/layout-primitives';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/auth.store';
import './index.css';

// Placeholder components (will be replaced with actual pages)
function DashboardPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to COTAMS</p>
    </PageContainer>
  );
}

function TimetablePage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold">Timetable</h1>
      <p className="text-muted-foreground">View and manage your timetable</p>
    </PageContainer>
  );
}

function NotificationsPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="text-muted-foreground">Your notifications</p>
    </PageContainer>
  );
}

function SettingsPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your account settings</p>
    </PageContainer>
  );
}

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">COTAMS</h1>
          <p className="text-muted-foreground mt-2">Login page coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cotams-theme">
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/timetable" element={<TimetablePage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
