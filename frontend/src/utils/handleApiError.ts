import axios from 'axios';

import type { ApiErrorResponse } from '@/types/api.types';

export function handleApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data) {
      // NestJS class-validator / ValidationPipe: { statusCode: 400, message: ["email must be an email", ...] }
      if (Array.isArray(data.message) && data.message.length > 0) {
        return data.message[0];
      }

      // Standard NestJS HttpException: { statusCode: 401, message: "Invalid credentials", error: "Unauthorized" }
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
      }

      // Fallback to error field: { statusCode: 400, error: "Bad Request" }
      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error;
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Please check your network connection.';
    }

    if (error.message && error.message !== 'Network Error') {
      return error.message;
    }

    return fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}
