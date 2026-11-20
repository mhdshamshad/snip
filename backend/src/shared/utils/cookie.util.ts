import { CookieOptions, Response } from 'express';

export const REFRESH_COOKIE_NAME = 'snip_refresh_token';

const DEFAULT_SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function getRefreshCookieOptions(
  isProduction: boolean,
  maxAgeMs: number = DEFAULT_SEVEN_DAYS_MS,
): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    partitioned: isProduction,
    path: '/',
    maxAge: maxAgeMs,
  } as CookieOptions;
}

export function setRefreshCookie(
  res: Response,
  token: string,
  isProduction: boolean,
  maxAgeMs?: number,
): void {
  res.cookie(
    REFRESH_COOKIE_NAME,
    token,
    getRefreshCookieOptions(isProduction, maxAgeMs),
  );
}

export function clearRefreshCookie(res: Response, isProduction: boolean): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getRefreshCookieOptions(isProduction),
    maxAge: 0,
  });
}
