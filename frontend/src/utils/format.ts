import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

export const formatDateTime = (date: string | Date) =>
  dayjs(date).format('MMM D, YYYY [at] h:mm A');

export const formatDate = (date: string | Date) => dayjs(date).format('MMM D, YYYY');

export const formatRelative = (date: string | Date) => dayjs(date).fromNow();

export function stripUrlProtocol(url: string = ''): string {
  return url.replace(/^https?:\/\//i, '');
}

export const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
