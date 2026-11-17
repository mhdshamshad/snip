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
