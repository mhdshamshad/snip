import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { authApi, authKeys, useAuthStore, type VerifyOtpFormType } from '@/features/auth';

export function useVerifyOtp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyOtpFormType) => authApi.verifyOtp(data),
    onSuccess: response => {
      const { user, accessToken } = response.data;

      useAuthStore.getState().setCredentials(user, accessToken);
      queryClient.setQueryData(authKeys.profile(), user);
      toast.success(response.message);
      navigate(APP_ROUTES.URLS, { replace: true });
    },
  });
}
