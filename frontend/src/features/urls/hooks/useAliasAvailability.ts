import { useQuery } from '@tanstack/react-query';
import { urlKeys } from '../api/urls.keys';
import { urlsApi } from '../api/urls.api';

export function useAliasAvailability(alias: string, enabled: boolean) {
  return useQuery({
    queryKey: urlKeys.aliasAvailability(alias),
    queryFn: () => urlsApi.checkAlias(alias),
    enabled,
    retry: false,
  });
}
