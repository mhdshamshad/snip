import type { UrlSortOption } from '../types/url.types';

export const urlKeys = {
  all: ['urls'] as const,
  list: (params: { search: string; sort: UrlSortOption }) =>
    [...urlKeys.all, 'list', params] as const,
};
