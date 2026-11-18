import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { URL_SORT_OPTIONS, urlKeys, urlsApi, type UrlSortOption } from '@/features/urls';

interface UseUrlsArgs {
  search: string;
  sort: UrlSortOption;
}

export function useUrls({ search, sort }: UseUrlsArgs) {
  const { sortBy, order } = URL_SORT_OPTIONS[sort];

  return useInfiniteQuery({
    queryKey: urlKeys.list({ search, sort }),
    queryFn: ({ pageParam }) =>
      urlsApi
        .list({
          search: search || undefined,
          sortBy,
          order,
          limit: 10,
          cursor: pageParam ?? undefined,
        })
        .then(response => response.data),
    initialPageParam: null as string | null,
    getNextPageParam: last => last.nextCursor,
    placeholderData: keepPreviousData,
  });
}

export function useUrlDetail(id: string) {
  return useQuery({
    queryKey: urlKeys.detail(id),
    queryFn: () => urlsApi.getById(id),
    enabled: Boolean(id),
    retry: false,
  });
}
