export enum OtpPurpose {
  REGISTER = 'register',
  PASSWORD_RESET = 'password_reset',
  EMAIL_CHANGE = 'email_change',
}

export const REDIS_KEYS = {
  AUTH: {
    USER_LOGGED_OUT_AT: (userId: string) => `auth:logged_out_at:${userId}`,
    DEVICE_LOGGED_OUT_AT: (userId: string, deviceId: string) =>
      `auth:logged_out_at:${userId}:${deviceId}`,
    BLACKLISTED_TOKEN: (token: string) => `auth:blacklisted:${token}`,
    REFRESH_TOKEN: (userId: string, deviceId: string) =>
      `auth:refresh:${userId}:${deviceId}`,
    REFRESH_PATTERN: (userId: string) => `auth:refresh:${userId}:*`,
    OTP: (purpose: OtpPurpose, identifier: string) =>
      `auth:otp:${purpose}:${identifier}`,
    OTP_ATTEMPTS: (purpose: OtpPurpose, identifier: string) =>
      `auth:otp_attempts:${purpose}:${identifier}`,
    EMAIL_CHANGE_LIMIT: (userId: string) => `auth:email_change_limit:${userId}`,
  },
} as const;

export const OTP_TTL_SECONDS = 10 * 60;
export const EMAIL_CHANGE_WINDOW_SECONDS = 7 * 24 * 60 * 60;
