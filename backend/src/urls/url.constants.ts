export const ALIAS_MIN = 3;
export const ALIAS_MAX = 32;
export const ALIAS_REGEX = new RegExp(
  `^[A-Za-z0-9_-]{${ALIAS_MIN},${ALIAS_MAX}}$`,
);
export const ALIAS_MESSAGE = `Alias must be ${ALIAS_MIN}-${ALIAS_MAX} characters: letters, numbers, - or _`;

export const RESERVED_ALIASES = new Set([
  'api',
  'app',
  'admin',
  'login',
  'logout',
  'signup',
  'register',
  'dashboard',
  'r',
  'new',
  'www',
  'help',
  'about',
  'settings',
]);
