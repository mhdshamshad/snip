export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',

  URLS: '/urls',
  URL_DETAILS: '/urls/:id',
  SETTINGS: '/settings',

  UNAUTHORIZED: '/403',
  SERVER_ERROR: '/500',
  NOT_FOUND: '/404',
} as const;
