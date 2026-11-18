import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authKeys, useAuthStore } from '@/features/auth';
import type { ChangePasswordInput } from '../validation/password-change.schema';
import { queryClient } from '@/lib/queryClient';
import { accountApi } from '../api/account.api';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => accountApi.changePassword(data),
    onSuccess: res => {
      const { user, accessToken } = res.data;
      useAuthStore.getState().setCredentials(user, accessToken);
      queryClient.setQueryData(authKeys.profile(), user);
      toast.success(res.message);
    },
  });
}
