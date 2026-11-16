export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME || 'Snip',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
} as const;
