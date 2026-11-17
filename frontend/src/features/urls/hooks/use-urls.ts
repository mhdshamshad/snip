import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { URL_SORT_OPTIONS } from '../constants/url.constants';
import { urlsApi } from '../api/urls.api';
import { urlKeys } from '../api/urls.keys';
import type { UrlSortOption } from '../types/url.types';

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
