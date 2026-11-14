export const AUTH_API = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
  SESSIONS: '/auth/sessions',
} as const;

export const URL_API = {
  BASE: '/urls',
  DETAIL: (id: string) => `/urls/${id}`,
  STATS: (id: string) => `/urls/${id}/stats`,
} as const;
