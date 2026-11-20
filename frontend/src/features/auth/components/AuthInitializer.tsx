import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { AppLoader } from '@/components/common';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useInitAuth } from '@/features/auth/hooks/useInitAuth';
import { AUTH_CHANNEL, AUTH_SESSION_EXPIRED_EVENT } from '@/lib/auth-channel';
import ServerErrorPage from '@/pages/ServerErrorPage';

interface AuthInitializerProps {
  children: ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const queryClient = useQueryClient();
  const { isInitializing, serverError } = useInitAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      queryClient.clear();
    };
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.onmessage = event => {
        if (event.data?.type === 'LOGOUT') {
          if (useAuthStore.getState().isAuthenticated) {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
          }
        }
      };
      return () => {
        channel.close();
        window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
      };
    }

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [queryClient]);

  if (isInitializing) {
    return <AppLoader label="Checking your session" />;
  }

  if (serverError) {
    return <ServerErrorPage />;
  }

  return <>{children}</>;
}
