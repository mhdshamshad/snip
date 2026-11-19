import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authKeys, useAuthStore, type AuthUser } from '@/features/auth';
import { accountApi } from '../api/account.api';

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => accountApi.updateEmail(data),
    onSuccess: res => {
      useAuthStore.getState().updateUser(res.data.user);
      queryClient.setQueryData<AuthUser>(authKeys.profile(), res.data.user);
      toast.success(res.message);
    },
  });
}
