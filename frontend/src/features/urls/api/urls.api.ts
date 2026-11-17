import { URL_API } from '@/constants/api-routes';
import { api } from '@/lib/axios';
import type { ApiResponse, CursorPaginatedData } from '@/types/api.types';
import type { ShortUrl, UrlListParams } from '@/features/urls';

export const urlsApi = {
  list: async (params: UrlListParams): Promise<ApiResponse<CursorPaginatedData<ShortUrl>>> => {
    const res = await api.get<ApiResponse<CursorPaginatedData<ShortUrl>>>(URL_API.BASE, {
      params,
    });
    return res.data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(URL_API.BY_ID(id));
    return res.data;
  },
};
