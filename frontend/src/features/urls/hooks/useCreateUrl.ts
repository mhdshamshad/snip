import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUrlFormType } from '../validation/url.schema';
import { urlsApi } from '../api/urls.api';
import { urlKeys } from '../api/urls.keys';

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
