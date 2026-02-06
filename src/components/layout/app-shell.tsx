import { type ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { getNavigationForRole } from '@/config/navigation.config';
import { useAuthStore } from '@/store/auth.store';
import { useRealtimeNotifications, useRealtimeTimetableUpdates } from '@/features/notifications/hooks';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Main application shell with responsive sidebar and topbar
 * Desktop: Fixed sidebar (lg:w-64) + topbar + content
 * Mobile: Drawer navigation (Sheet) + topbar + content
 * 
 * Navigation is role-based and automatically determined from user's roles
 */
export function AppShell({ children }: AppShellProps) {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useRealtimeNotifications();
  useRealtimeTimetableUpdates();
  
  // Get navigation based on user roles
  const userRoles = user?.roles?.map(r => r.code) || ['STUDENT'];
  const navigation = getNavigationForRole(userRoles);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      {sidebarOpen && (
        <aside className="hidden lg:flex lg:w-64 lg:flex-col">
          <Sidebar navigation={navigation} />
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          navigation={navigation}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 lg:px-4">
          {children}
        </main>
      </div>
    </div>
  );
}
