export const AUTH_CHANNEL = 'auth_sync_channel';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

export function broadcastLogout(): void {
  if (typeof BroadcastChannel === 'undefined') {
    return;
  }

  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.postMessage({ type: 'LOGOUT' });
  channel.close();
}

export function notifySessionExpired(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}
