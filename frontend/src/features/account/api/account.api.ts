import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import { USER_API } from '@/constants/api-routes';
import type { AuthUser } from '@/features/auth';

export const accountApi = {
  updateName: async (name: string): Promise<ApiResponse<{ user: AuthUser }>> => {
    const res = await api.patch<ApiResponse<{ user: AuthUser }>>(USER_API.ME, { name });
    return res.data;
  },
};
