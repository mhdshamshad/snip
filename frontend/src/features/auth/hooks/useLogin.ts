import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, authKeys, useAuthStore, type LoginFormType } from '@/features/auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormType) => authApi.login(data),
    onSuccess: res => {
      const { user, accessToken } = res.data;

      useAuthStore.getState().setCredentials(user, accessToken);
      queryClient.setQueryData(authKeys.profile(), user);

      toast.success('Logged in successfully');
    },
  });
}
