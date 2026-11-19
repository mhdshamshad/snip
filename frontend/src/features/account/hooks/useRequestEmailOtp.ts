import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountApi } from '../api/account.api';

export function useRequestEmailOtp() {
  return useMutation({
    mutationFn: (email: string) => accountApi.requestEmailOtp(email),
    onSuccess: res => {
      toast.success(res.message);
    },
  });
}
