export const AUTH_CHANNEL = 'auth_sync_channel';

export function broadcastLogout(): void {
  const channel = new BroadcastChannel(AUTH_CHANNEL);
  channel.postMessage('LOGOUT');
  channel.close();
}
