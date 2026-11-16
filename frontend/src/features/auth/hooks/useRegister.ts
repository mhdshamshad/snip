import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/constants/app-routes';
import { authApi, type RegisterRequest } from '@/features/auth';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      navigate(APP_ROUTES.VERIFY_OTP, {
        state: { email: variables.email },
      });
    },
  });
}
