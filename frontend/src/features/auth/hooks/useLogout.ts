import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { broadcastLogout } from '@/lib/auth-channel';
import { handleApiError } from '@/utils/handleApiError';
import { isServerError } from '@/utils/isServerError';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: response => {
      toast.success(response.message);
    },
    onError: error => {
      if (isServerError(error)) {
        toast.warning('Could not reach the server. You may be signed in again after a reload.');
      } else {
        toast.error(handleApiError(error));
      }
    },
    onSettled: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      broadcastLogout();
      navigate(APP_ROUTES.LOGIN, { replace: true });
    },
  });
}
