import { useCallback, useState } from 'react';
import { ArrowUpDown, Plus } from 'lucide-react';

import { Button, ConfirmDialog, EmptyState, ErrorState, SearchInput } from '@/components/common';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { handleApiError } from '@/utils/handleApiError';
import {
  useUrls,
  useDeleteUrl,
  URL_SORT_OPTIONS,
  type ShortUrl,
  type UrlSortOption,
  UrlListSkeleton,
  UrlList,
} from '@/features/urls';
import { stripUrlProtocol } from '@/utils/url-format';

const SORT_OPTIONS = Object.entries(URL_SORT_OPTIONS).map(([value, option]) => ({
  value: value as UrlSortOption,
  label: option.label,
}));
const URL_FILTERS = [
  {
    key: 'sort',
    defaultValue: 'newest',
    parser: (value: string): UrlSortOption =>
      Object.keys(URL_SORT_OPTIONS).includes(value) ? (value as UrlSortOption) : 'newest',
  },
] as const;

type UrlListFilters = Record<string, unknown> & { sort: UrlSortOption };

export default function UrlListPage() {
  const { search, sort, updateParams } = useUrlFilterParams<UrlListFilters>(URL_FILTERS);
  const [toDelete, setToDelete] = useState<ShortUrl | null>(null);
  const { mutateAsync: deleteUrl, isPending: isDeletingUrl } = useDeleteUrl();

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useUrls({ search, sort });

  const items = data?.pages.flatMap(page => page.data) ?? [];

  const handleSearchChange = useCallback(
    (value: string) => updateParams({ search: value }),
    [updateParams]
  );

  const handleLoadNextPage = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const sortLabel = URL_SORT_OPTIONS[sort].label;
  const isSearching = search.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            My URLs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and sort the links saved to your account.
          </p>
        </div>
        <Button
          type="button"
          leftIcon={<Plus className="size-4" />}
          className="h-10 w-full shrink-0 sm:w-auto"
        >
          Create link
        </Button>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b-2 border-border bg-muted/40 p-3 sm:flex-row sm:items-center sm:p-4">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by destination or short link..."
            aria-label="Search links"
            className="min-w-0 flex-1"
            loading={isFetching && !isFetchingNextPage}
          />
          <label className="relative block sm:w-48 sm:shrink-0">
            <span className="sr-only">Sort links</span>
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              aria-label="Sort links"
              onChange={event => updateParams({ sort: event.target.value })}
              className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isPending ? (
          <UrlListSkeleton />
        ) : isError && !data ? (
          <ErrorState
            description={handleApiError(error, 'Could not load your links.')}
            onRetry={() => {
              void refetch();
            }}
            className="m-4 border-0 bg-transparent"
          />
        ) : items.length === 0 ? (
          isSearching ? (
            <EmptyState
              title="No matching links"
              description={`Nothing matches "${search}". Try a different word or clear the search.`}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateParams({ search: '' })}
                >
                  Clear search
                </Button>
              }
              className="m-4 border-0 bg-transparent"
            />
          ) : (
            <EmptyState
              title="No links yet"
              description="Links you create will show up here."
              className="m-4 border-0 bg-transparent"
            />
          )
        ) : (
          <div
            className={
              isFetching && !isFetchingNextPage ? 'opacity-60 transition-opacity' : undefined
            }
          >
            <UrlList
              urls={items}
              onDelete={setToDelete}
              hasNextPage={hasNextPage && !isFetchNextPageError}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={handleLoadNextPage}
            />
          </div>
        )}
        {isFetchNextPageError && (
          <div className="flex justify-center py-3">
            <Button type="button" variant="outline" size="sm" onClick={handleLoadNextPage}>
              Couldn&apos;t load more. Try again
            </Button>
          </div>
        )}
      </section>

      {!isPending && data && items.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {items.length} loaded {items.length === 1 ? 'link' : 'links'}
          {hasNextPage ? ' · scroll to load more' : ''}
          {' · '}
          {sortLabel.toLowerCase()}
        </p>
      )}
      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        isLoading={isDeletingUrl}
        onConfirm={async () => {
          if (!toDelete) {return;}

          await deleteUrl(toDelete.id);
          setToDelete(null);
        }}
        title="Delete this link?"
        description={
          <span>
            <span className="mt-1 block break-all rounded-md bg-muted px-2.5 py-2 font-mono text-xs font-medium text-foreground">
              {stripUrlProtocol(toDelete?.shortUrl ?? '')}
            </span>

            <span className="mt-2 block leading-relaxed">
              This link will stop redirecting immediately. Its{' '}
              <span className="font-medium text-foreground">
                {toDelete?.clicks ?? 0} recorded{' '}
                {(toDelete?.clicks ?? 0) === 1 ? 'click' : 'clicks'}
              </span>{' '}
              will also be permanently removed.
            </span>

            <span className="mt-1 block text-muted-foreground">This action cannot be undone.</span>
          </span>
        }
        confirmLabel="Delete link"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
