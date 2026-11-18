import { useQuery } from '@tanstack/react-query';
import { urlKeys, urlsApi } from '@/features/urls';

export function useAliasAvailability(alias: string, enabled: boolean) {
  return useQuery({
    queryKey: urlKeys.aliasAvailability(alias),
    queryFn: () => urlsApi.checkAlias(alias),
    enabled,
    retry: false,
  });
}
