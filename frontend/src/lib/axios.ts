import axios, { type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { AUTH_API } from '@/constants/api-routes';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import type { AuthUser } from '@/features/auth/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  user: AuthUser;
}

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

const PUBLIC_URLS = new Set<string>([
  AUTH_API.LOGIN,
  AUTH_API.GOOGLE,
  AUTH_API.REGISTER,
  AUTH_API.VERIFY_OTP,
  AUTH_API.RESEND_OTP,
  AUTH_API.FORGOT_PASSWORD,
  AUTH_API.RESET_PASSWORD,
]);

export const isPublicRequest = (url?: string): boolean => PUBLIC_URLS.has(url ?? '');

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= refreshClient
    .post<ApiResponse<RefreshResponse>>(AUTH_API.REFRESH)
    .then(({ data }) => {
      const { accessToken, user } = data.data;
      useAuthStore.getState().setCredentials(user, accessToken);
      return accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

api.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isPublicRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const sentToken = originalRequest.headers.Authorization;
    const currentToken = useAuthStore.getState().accessToken;
    if (currentToken && sentToken !== `Bearer ${currentToken}`) {
      originalRequest.headers.Authorization = `Bearer ${currentToken}`;
      return api(originalRequest);
    }

    try {
      originalRequest.headers.Authorization = `Bearer ${await refreshAccessToken()}`;
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }
      return Promise.reject(refreshError);
    }

    return api(originalRequest);
  }
);
