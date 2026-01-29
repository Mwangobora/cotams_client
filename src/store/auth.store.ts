import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (accessToken, refreshToken, user) => {
        Cookies.set('access_token', accessToken, { expires: 1 }); // 1 day
        Cookies.set('refresh_token', refreshToken, { expires: 7 }); // 7 days
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
