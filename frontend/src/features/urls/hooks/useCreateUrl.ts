import { useMutation, useQueryClient } from '@tanstack/react-query';
import { urlKeys, urlsApi, type CreateUrlFormType } from '@/features/urls';

export function useCreateUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUrlFormType) => urlsApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: urlKeys.all,
      });
    },
  });
}
