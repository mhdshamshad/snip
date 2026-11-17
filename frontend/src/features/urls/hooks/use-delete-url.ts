import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { urlsApi } from '../api/urls.api';
import { urlKeys } from '../api/urls.keys';

export function useDeleteUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => urlsApi.delete(id),
    onSuccess: async res => {
      await queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
      toast.success(res.message);
    },
  });
}
