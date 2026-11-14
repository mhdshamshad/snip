export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  DASHBOARD: '/dashboard',
  URLS: '/dashboard/urls',
  URL_DETAILS: '/dashboard/urls/:id',
  SETTINGS: '/dashboard/settings',
  UNAUTHORIZED: '/403',
  SERVER_ERROR: '/500',
  NOT_FOUND: '/404',
} as const;
