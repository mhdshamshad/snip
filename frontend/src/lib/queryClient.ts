import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { isPublicRequest } from '@/lib/axios';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { handleApiError } from '@/utils/handleApiError';

const isSessionExpiredRedirect = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 401 &&
  !isPublicRequest(error.config?.url) &&
  !useAuthStore.getState().isAuthenticated;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      retry: (failureCount, error) => {
        // Do not retry 4xx client errors (400, 401, 403, 404, etc.)
        if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      onError: error => {
        if (isSessionExpiredRedirect(error)) {
          return;
        }
        toast.error(handleApiError(error));
      },
    },
  },
});

useAuthStore.subscribe((state, prev) => {
  if (prev.isAuthenticated && !state.isAuthenticated) {
    queryClient.clear();
  }
});
