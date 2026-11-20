import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setCredentials: (user: AuthUser, accessToken: string) => void;
  updateUser: (fields: Partial<AuthUser>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setCredentials: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    });
  },

  updateUser: fields => {
    set(state => ({
      user: state.user ? { ...state.user, ...fields } : null,
    }));
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  },
}));
