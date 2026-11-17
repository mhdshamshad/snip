export function stripUrlProtocol(url: string = ''): string {
  return url.replace(/^https?:\/\//i, '');
}

export function stripTrailingSlash(url: string = ''): string {
  return url.replace(/\/+$/, '');
}
