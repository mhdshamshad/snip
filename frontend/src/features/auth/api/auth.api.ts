import { AUTH_API } from '@/constants/api-routes';
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import {
  type LoginFormType,
  type LoginResponse,
  type RegisterRequest,
  type ResendOtpRequest,
  type VerifyOtpFormType,
} from '@/features/auth';

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>(AUTH_API.REGISTER, data);
    return res.data;
  },
  verifyOtp: async (data: VerifyOtpFormType): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(AUTH_API.VERIFY_OTP, data);
    return res.data;
  },
  resendOtp: async (data: ResendOtpRequest): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>(AUTH_API.RESEND_OTP, data);
    return res.data;
  },
  login: async (data: LoginFormType): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(AUTH_API.LOGIN, data);
    return res.data;
  },
  logout: async (): Promise<ApiResponse<null>> => {
    const res = await api.post<ApiResponse<null>>(AUTH_API.LOGOUT);
    return res.data;
  },
};
