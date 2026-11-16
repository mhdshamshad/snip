import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { authApi, type ResetPasswordRequest } from '@/features/auth';

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: response => {
      toast.success(response.message);
      navigate(APP_ROUTES.LOGIN, { replace: true });
    },
  });
}
