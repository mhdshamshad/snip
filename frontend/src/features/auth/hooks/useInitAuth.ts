import axios from 'axios';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/features/auth';
import { refreshAccessToken } from '@/lib/axios';
import { isServerError } from '@/utils/isServerError';

export function useInitAuth() {
  const { isInitializing } = useAuthStore();
  const [serverError, setServerError] = useState(false);
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (useAuthStore.getState().accessToken) {
        useAuthStore.getState().finishInitialization();
        return;
      }

      try {
        await refreshAccessToken();
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;

        if (status !== 401 && !isServerError(error)) {
          console.error('Session restoration failed:', error);
        }
        if (isMounted) {
          if (isServerError(error)) {
            setServerError(true);
          }
          useAuthStore.getState().clearAuth();
        }
      } finally {
        if (isMounted) {
          useAuthStore.getState().finishInitialization();
        }
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return { isInitializing, serverError };
}
