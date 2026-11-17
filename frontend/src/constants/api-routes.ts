export const AUTH_API = {
  LOGIN: '/auth/login',
  GOOGLE: '/auth/google',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
  SESSIONS: '/auth/sessions',
} as const;

export const URL_API = {
  BASE: '/urls',
  BY_ID: (id: string) => `/urls/${id}`,
  STATS: (id: string) => `/urls/${id}/stats`,
  CHECK_ALIAS: '/urls/check-alias',
} as const;
