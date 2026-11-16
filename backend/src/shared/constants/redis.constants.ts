export const REDIS_KEYS = {
  AUTH: {
    USER_LOGGED_OUT_AT: (userId: string) => `auth:logged_out_at:${userId}`,
    DEVICE_LOGGED_OUT_AT: (userId: string, deviceId: string) =>
      `auth:logged_out_at:${userId}:${deviceId}`,
    BLACKLISTED_TOKEN: (token: string) => `auth:blacklisted:${token}`,
    REFRESH_TOKEN: (userId: string, deviceId: string) =>
      `auth:refresh:${userId}:${deviceId}`,
    REFRESH_PATTERN: (userId: string) => `auth:refresh:${userId}:*`,
    REGISTER_OTP: (email: string) => `auth:register_otp:${email}`,
  },
} as const;

export const OTP_TTL_SECONDS = 10 * 60;
