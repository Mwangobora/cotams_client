/**
 * Authentication Store (Zustand)
 * Manages current user state and auth operations
 * Tokens are managed via httpOnly cookies by backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user, isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => {
        set({ user: null, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
