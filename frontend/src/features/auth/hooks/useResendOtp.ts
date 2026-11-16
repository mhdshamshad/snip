import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi, type ResendOtpRequest } from '@/features/auth';

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authApi.resendOtp(data),
    onSuccess: response => {
      toast.success(response.message);
    },
  });
}
