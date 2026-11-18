import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { urlKeys, urlsApi } from '@/features/urls';
export function useDeleteUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => urlsApi.delete(id),
    onSuccess: (res, id) => {
      queryClient.removeQueries({ queryKey: urlKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
      toast.success(res.message ?? 'Link deleted');
    },
  });
}
