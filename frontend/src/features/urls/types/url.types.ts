import type { SortOrder } from '@/types/api.types';

export interface ShortUrl {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export type UrlSortBy = 'createdAt' | 'clicks';
export type UrlSortOption = 'newest' | 'oldest' | 'mostClicks' | 'leastClicks';

export interface UrlListParams {
  search?: string;
  sortBy: UrlSortBy;
  order: SortOrder;
  limit?: number;
  cursor?: string | null;
}
