import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from '@/features/auth';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: response => {
      toast.success(response.message);
    },
  });
}
