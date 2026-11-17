import { Url } from '@prisma/client';

export type UrlResponse = Omit<Url, 'shortCode' | 'updatedAt' | 'userId'> & {
  shortUrl: string;
  code: string;
};

export function toUrlResponse(
  url: Pick<Url, 'id' | 'shortCode' | 'originalUrl' | 'clicks' | 'createdAt'>,
  baseUrl: string,
): UrlResponse {
  return {
    id: url.id,
    code: url.shortCode,
    originalUrl: url.originalUrl,
    shortUrl: `${baseUrl}/r/${url.shortCode}`,
    clicks: url.clicks,
    createdAt: url.createdAt,
  };
}
