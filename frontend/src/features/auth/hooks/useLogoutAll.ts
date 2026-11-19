import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { broadcastLogout } from '@/lib/auth-channel';
import { authApi, useAuthStore } from '@/features/auth';

export function useLogoutAll() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: res => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      broadcastLogout();
      navigate(APP_ROUTES.LOGIN, { replace: true });
      toast.success(res.message);
    },
  });
}
