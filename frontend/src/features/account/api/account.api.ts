import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import { AUTH_API, USER_API } from '@/constants/api-routes';
import type { AuthUser, LoginResponse } from '@/features/auth';
import type { ChangePasswordInput } from '../validation/password-change.schema';

export const accountApi = {
  updateName: async (name: string): Promise<ApiResponse<{ user: AuthUser }>> => {
    const res = await api.patch<ApiResponse<{ user: AuthUser }>>(USER_API.ME, { name });
    return res.data;
  },
  changePassword: async (data: ChangePasswordInput): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.patch<ApiResponse<LoginResponse>>(AUTH_API.CHANGE_PASSWORD, data);
    return res.data;
  },
};
