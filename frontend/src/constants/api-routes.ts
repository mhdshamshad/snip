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
  CHANGE_EMAIL: '/auth/email-change',
  VERIFY_EMAIL_CHANGE: '/auth/email-change/verify',
  CHANGE_PASSWORD: '/auth/password',
} as const;

export const URL_API = {
  BASE: '/urls',
  BY_ID: (id: string) => `/urls/${id}`,
  CHECK_ALIAS: '/urls/check-alias',
  RESOLVE: (code: string) => `/urls/resolve/${encodeURIComponent(code)}`,
} as const;

export const USER_API = { ME: '/users/me' } as const;
