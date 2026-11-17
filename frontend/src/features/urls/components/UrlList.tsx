import dayjs from 'dayjs';
import { ExternalLink, MousePointerClick } from 'lucide-react';

import { CopyButton, Spinner } from '@/components/common';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { UrlRowActions, UrlSiteIcon, type ShortUrl } from '@/features/urls';

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
                className="group border-b border-border last:border-b-0 transition-colors hover:bg-accent/40"
              >
                <td className="px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UrlSiteIcon originalUrl={url.originalUrl} />
                    <div className="min-w-0">
                      <ShortUrlLink url={url} />
                      <p
                        className="truncate text-[13px] text-muted-foreground group-hover:text-foreground/70"
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                  {url.clicks}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  <span title={dayjs(url.createdAt).format('MMMM D, YYYY h:mm A')}>
                    {dayjs(url.createdAt).format('MMM D, YYYY')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <CopyButton value={url.shortUrl} label="short link" />
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${url.originalUrl}`}
                      title="Open destination"
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <UrlRowActions url={url} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {urls.map(url => (
          <li key={url.id} className="px-4 py-3.5 transition-colors active:bg-accent/40">
            <div className="flex items-start gap-3">
              <UrlSiteIcon originalUrl={url.originalUrl} />
              <div className="min-w-0 flex-1">
                <ShortUrlLink url={url} />
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {url.originalUrl}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MousePointerClick className="size-3.5" />
                    <span className="font-medium tabular-nums text-foreground">{url.clicks}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{dayjs(url.createdAt).format('MMM D, YYYY')}</span>
                </div>
              </div>
              <UrlRowActions url={url} onDelete={onDelete} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 pl-12">
              <a
                href={url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent"
              >
                <ExternalLink className="size-4" />
                Open
              </a>
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
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-border/60" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-48 rounded bg-border/60" />
                      <div className="h-3 w-72 max-w-full rounded bg-border/60" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="ml-auto h-3.5 w-8 rounded bg-border/60" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-3.5 w-20 rounded bg-border/60" />
                </td>
                <td className="px-5 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-border md:hidden" aria-label="Loading links">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="flex animate-pulse items-center gap-3 px-4 py-3.5">
            <div className="size-9 rounded-lg bg-border/60" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-40 rounded bg-border/60" />
              <div className="h-3 w-full rounded bg-border/60" />
              <div className="h-3 w-24 rounded bg-border/60" />
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

function ShortUrlLink({ url }: { url: ShortUrl }) {
  return (
    <a
      href={url.shortUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-full items-center gap-1 font-mono text-sm font-semibold text-foreground"
      title={`Open ${url.shortUrl}`}
    >
      <span className="truncate">{url.shortUrl.replace(/^https?:\/\//i, '')}</span>
      <ExternalLink className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
