import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setCredentials: (user: AuthUser, accessToken: string) => void;
  updateToken: (accessToken: string) => void;
  updateUser: (fields: Partial<AuthUser>) => void;
  clearAuth: () => void;
  finishInitialization: () => void;
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

  updateToken: accessToken => {
    set(state => ({
      accessToken,
      isAuthenticated: Boolean(state.user && accessToken),
    }));
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

  finishInitialization: () => {
    set({ isInitializing: false });
  },
}));
