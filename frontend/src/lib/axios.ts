import axios, { type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { AUTH_API } from '@/constants/api-routes';
import { useAuthStore, type AuthUser } from '@/features/auth';
import type { ApiResponse } from '@/types/api.types';
import { notifySessionExpired } from '@/lib/auth-channel';

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
  AUTH_API.REGISTER,
  AUTH_API.VERIFY_OTP,
  AUTH_API.RESEND_OTP,
  AUTH_API.REFRESH,
]);

export const isPublicRequest = (url?: string): boolean => {
  if (!url) {
    return false;
  }
  const path = url.split('?')[0].replace(/\/+$/, '');
  return PUBLIC_URLS.has(path);
};

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;

  if (isPublicRequest(config.url)) {
    delete config.headers.Authorization;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<RefreshResponse> | null = null;

const requestRefresh = () => refreshClient.post<ApiResponse<RefreshResponse>>(AUTH_API.REFRESH, {});

export function refreshAccessToken(): Promise<RefreshResponse> {
  refreshPromise ??= (
    'locks' in navigator
      ? navigator.locks.request('auth_refresh', requestRefresh)
      : requestRefresh()
  )
    .then(({ data }) => {
      const { accessToken, user } = data.data;

      if (!accessToken || !user) {
        throw new Error('Refresh response did not contain user or access token.');
      }
      useAuthStore.getState().setCredentials(user, accessToken);
      return { accessToken, user };
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function expireCurrentSession(): void {
  useAuthStore.getState().clearAuth();
  notifySessionExpired();
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
      expireCurrentSession();
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
      const { accessToken } = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        expireCurrentSession();
        return Promise.reject(error);
      }
      return Promise.reject(refreshError);
    }

    return api(originalRequest);
  }
);
