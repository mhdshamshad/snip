import { MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CopyButton, Skeleton, Spinner } from '@/components/common';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { formatDate, formatDateTime, stripUrlProtocol } from '@/utils/format';
import { OpenDestinationLink, UrlRowActions, UrlSiteIcon, type ShortUrl } from '@/features/urls';
import { APP_ROUTES } from '@/constants/app-routes';

interface UrlListProps {
  urls: ShortUrl[];
  onDelete: (url: ShortUrl) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function UrlList({
  urls,
  onDelete,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UrlListProps) {
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full table-fixed text-sm">
          <UrlTableColumns />
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-sm font-semibold text-foreground/80">
              <th scope="col" className="px-5 py-3.5">
                Link
              </th>
              <th scope="col" className="px-3 py-3.5 text-right">
                Clicks
              </th>
              <th scope="col" className="px-3 py-3.5">
                Created
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {urls.map(url => (
              <tr
                key={url.id}
                className="group border-b border-border transition-colors last:border-b-0 hover:bg-accent/40"
              >
                <td className="px-5 py-3">
                  <UrlIdentity url={url} />
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                  {url.clicks}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  <span title={formatDateTime(url.createdAt)}>{formatDate(url.createdAt)}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <CopyButton value={url.shortUrl} label="short link" />
                    <OpenDestinationLink href={url.originalUrl} />
                    <UrlRowActions url={url} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <ul className="divide-y divide-border md:hidden">
        {urls.map(url => (
          <li key={url.id} className="px-4 py-3.5 transition-colors active:bg-accent/40">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <UrlIdentity url={url} />
                <div className="mt-2 flex items-center gap-2 pl-12 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MousePointerClick className="size-3.5" />
                    <span className="font-medium tabular-nums text-foreground">{url.clicks}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(url.createdAt)}</span>
                </div>
              </div>
              <UrlRowActions url={url} onDelete={onDelete} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 pl-12">
              <OpenDestinationLink href={url.originalUrl} variant="button" />
              <CopyButton value={url.shortUrl} showLabel variant="primary" className="h-9 px-2.5" />
            </div>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div
          ref={observerRef}
          className="flex min-h-12 items-center justify-center py-3"
          role={isFetchingNextPage ? 'status' : undefined}
          aria-label={isFetchingNextPage ? 'Loading more links' : undefined}
        >
          {isFetchingNextPage && <Spinner size="sm" className="text-muted-foreground" />}
        </div>
      )}
    </>
  );
}

export function UrlListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full table-fixed text-sm" aria-label="Loading links">
          <UrlTableColumns />
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-3.5 w-48" />
                      <Skeleton className="h-3 w-72 max-w-full" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Skeleton className="ml-auto h-3.5 w-8" />
                </td>
                <td className="px-3 py-3">
                  <Skeleton className="h-3.5 w-20" />
                </td>
                <td className="px-5 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden" aria-label="Loading links">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="size-9 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function UrlTableColumns() {
  return (
    <colgroup>
      <col />
      <col className="w-24" />
      <col className="w-36" />
      <col className="w-32" />
    </colgroup>
  );
}

function UrlIdentity({ url }: { url: ShortUrl }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UrlSiteIcon originalUrl={url.originalUrl} />
      <div className="min-w-0">
        <Link
          to={APP_ROUTES.URL_DETAILS.replace(':id', encodeURIComponent(url.id))}
          state={{ url }}
          title="View details"
          className="block max-w-full truncate font-mono text-sm font-semibold text-foreground hover:underline"
        >
          {stripUrlProtocol(url.shortUrl)}
        </Link>
        <p
          className="truncate text-[13px] text-muted-foreground group-hover:text-foreground/70"
          title={url.originalUrl}
        >
          {url.originalUrl}
        </p>
      </div>
    </div>
  );
}
