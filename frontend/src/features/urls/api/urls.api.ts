import { URL_API } from '@/constants/api-routes';
import { api } from '@/lib/axios';
import type { ApiResponse, CursorPaginatedData } from '@/types/api.types';
import type { ShortUrl, UrlListParams } from '../types/url.types';

export const urlsApi = {
  list: async (params: UrlListParams): Promise<ApiResponse<CursorPaginatedData<ShortUrl>>> => {
    const res = await api.get<ApiResponse<CursorPaginatedData<ShortUrl>>>(URL_API.BASE, {
      params,
    });
    return res.data;
  },
};
