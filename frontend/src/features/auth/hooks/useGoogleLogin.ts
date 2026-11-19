import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { authApi, authKeys, useAuthStore, type GoogleAuthPayload } from '@/features/auth';
import { handleApiError } from '@/utils/handleApiError';

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (data: GoogleAuthPayload) => authApi.googleLogin(data),
    onSuccess: response => {
      const { user, accessToken } = response.data;

      useAuthStore.getState().setCredentials(user, accessToken);
      queryClient.setQueryData(authKeys.profile(), user);
      toast.success('Logged in successfully');

      const from = (location.state as { from?: Location } | null)?.from;
      const target =
        from?.pathname.startsWith(APP_ROUTES.URLS) || from?.pathname === APP_ROUTES.SETTINGS
          ? from.pathname + from.search + from.hash
          : APP_ROUTES.URLS;
      navigate(target, { replace: true });
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });
}
