import type { SortOrder } from '@/types/api.types';
import type { UrlSortBy, UrlSortOption } from '../types/url.types';

export const URL_SORT_OPTIONS: Record<
  UrlSortOption,
  { label: string; sortBy: UrlSortBy; order: SortOrder }
> = {
  newest: { label: 'Newest first', sortBy: 'createdAt', order: 'desc' },
  oldest: { label: 'Oldest first', sortBy: 'createdAt', order: 'asc' },
  mostClicks: { label: 'Most clicks', sortBy: 'clicks', order: 'desc' },
  leastClicks: { label: 'Least clicks', sortBy: 'clicks', order: 'asc' },
};

export const ALIAS_MIN = 3;
export const ALIAS_MAX = 32;
export const ALIAS_REGEX = /^[A-Za-z0-9_-]+$/;

export const ALIAS_MESSAGE = `Alias must be ${ALIAS_MIN}-${ALIAS_MAX} characters: letters, numbers, - or _`;

export const isValidAlias = (value: string) =>
  value.length >= ALIAS_MIN && value.length <= ALIAS_MAX && ALIAS_REGEX.test(value);
