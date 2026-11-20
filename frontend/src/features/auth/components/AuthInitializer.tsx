import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppLoader } from '@/components/common';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { AUTH_CHANNEL } from '@/lib/auth-channel';
import { refreshAccessToken } from '@/lib/axios';
import { isServerError } from '@/utils/isServerError';
import ServerErrorPage from '@/pages/ServerErrorPage';

export function AuthInitializer() {
  const isInitializing = useAuthStore(state => state.isInitializing);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    refreshAccessToken().catch(error => {
      setServerError(isServerError(error));
      useAuthStore.getState().clearAuth();
    });

    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.onmessage = () => useAuthStore.getState().clearAuth();
    return () => channel.close();
  }, []);

  if (isInitializing) {
    return <AppLoader label="Checking your session" />;
  }
  if (serverError) {
    return <ServerErrorPage />;
  }
  return <Outlet />;
}
