import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { AppRouter } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { authApi } from '@/apis/AuthApi';
import { useAuthStore } from '@/store/auth.store';

function AuthBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let isActive = true;
    const loadUser = async () => {
      setLoading(true);
      console.log('[AuthBootstrap] loading /auth/me');
      try {
        const response = await authApi.me();
        console.log('[AuthBootstrap] /auth/me response', response);
        if (isActive) {
          const user = response.user ?? (response as any);
          setUser(user);
        }
      } catch (error) {
        console.log('[AuthBootstrap] /auth/me error', error);
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isActive = false;
    };
  }, [setLoading, setUser]);

  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cotams-theme">
      <QueryProvider>
        <BrowserRouter>
          <AuthBootstrap />
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
