import type { UrlSortOption } from '../types/url.types';

export const urlKeys = {
  all: ['urls'] as const,
  lists: () => [...urlKeys.all, 'list'] as const,
  list: (params: { search: string; sort: UrlSortOption }) => [...urlKeys.lists(), params] as const,
  detail: (id: string) => [...urlKeys.all, 'detail', id] as const,
  aliasAvailability: (alias: string) => [...urlKeys.all, 'alias-availability', alias] as const,
};
