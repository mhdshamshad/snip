import { AUTH_API } from '@/constants/api-routes';
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { LoginFormType, LoginResponse } from '@/features/auth';

export const authApi = {
  login: async (data: LoginFormType): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(AUTH_API.LOGIN, data);
    return res.data;
  },
  logout: async (): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>(AUTH_API.LOGOUT);
    return res.data;
  },
};
