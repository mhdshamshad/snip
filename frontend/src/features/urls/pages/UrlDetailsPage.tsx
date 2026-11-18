import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link2Off, MousePointerClick, Timer, Trash2 } from 'lucide-react';

import { Button, CopyButton, Skeleton } from '@/components/common';
import { APP_ROUTES } from '@/constants/app-routes';
import {
  formatDateTime,
  formatNumber,
  formatRelative,
  getDomain,
  stripUrlProtocol,
} from '@/utils/format';
import {
  DeleteUrlModal,
  OpenDestinationLink,
  Panel,
  PanelHeader,
  QrCodePanel,
  UrlSiteIcon,
  useUrlDetail,
  type ShortUrl,
} from '@/features/urls';

export default function UrlDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: url, isLoading, isError } = useUrlDetail(id);
  const [toDelete, setToDelete] = useState<ShortUrl | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="flex items-center gap-3">
          <Skeleton className="size-11" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-3.5 w-72" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Skeleton className="h-26" />
              <Skeleton className="h-26" />
            </div>
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !url) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Panel>
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Link2Off className="size-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Link not found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              This link doesn't exist, was deleted, or belongs to another account.
            </p>
            <Link
              to={APP_ROUTES.URLS}
              className="mt-5 inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back to My URLs
            </Link>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <UrlSiteIcon originalUrl={url.originalUrl} size="lg" />
          <div className="min-w-0">
            <h1 className="break-all font-mono text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {stripUrlProtocol(url.shortUrl)}
            </h1>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={url.originalUrl}
              className="mt-0.5 block truncate text-[13px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              {url.originalUrl}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <CopyButton
            value={url.shortUrl}
            variant="primary"
            label="Copy link"
            showLabel
            className="h-9"
          />
          <OpenDestinationLink href={url.originalUrl} variant="button" label="Open destination" />
          <Button
            variant="outline"
            onClick={() => setToDelete(url)}
            className="col-span-2 text-destructive hover:text-destructive sm:col-span-1"
            leftIcon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <StatCard
              label="Total clicks"
              icon={<MousePointerClick className="size-4" strokeWidth={1.75} />}
              value={formatNumber(url.clicks)}
              hint="All time"
            />
            <StatCard
              label="Last click"
              icon={<Timer className="size-4" strokeWidth={1.75} />}
              value={url.lastClickedAt ? formatRelative(url.lastClickedAt) : '—'}
              hint={url.lastClickedAt ? formatDateTime(url.lastClickedAt) : 'No clicks yet'}
            />
          </div>

          <Panel>
            <PanelHeader title="Details" />
            <dl className="divide-y divide-border">
              <MetaRow label="Short URL">
                <span className="font-mono">{url.shortUrl}</span>
              </MetaRow>
              <MetaRow label="Destination">{url.originalUrl}</MetaRow>
              <MetaRow label="Domain">
                <span className="inline-flex items-center gap-2">
                  <UrlSiteIcon originalUrl={url.originalUrl} size="sm" />
                  {getDomain(url.originalUrl)}
                </span>
              </MetaRow>
              <MetaRow label="Alias">
                <span className="font-mono">{url.code}</span>
              </MetaRow>
              <MetaRow label="Created">{formatDateTime(url.createdAt)}</MetaRow>
              <MetaRow label="Last clicked">
                {url.lastClickedAt ? formatDateTime(url.lastClickedAt) : 'Never'}
              </MetaRow>
            </dl>
          </Panel>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <QrCodePanel value={url.shortUrl} code={url.code} />
        </div>
      </div>

      <DeleteUrlModal
        url={toDelete}
        onClose={() => setToDelete(null)}
        onDeleted={() => navigate(APP_ROUTES.URLS, { replace: true })}
      />
    </div>
  );
}

function StatCard({
  label,
  icon,
  value,
  hint,
}: {
  label: string;
  icon: ReactNode;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-xs sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <span className="text-muted-foreground/70">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[140px_1fr] sm:gap-4 sm:px-5">
      <dt className="text-xs font-medium text-muted-foreground sm:text-[13px]">{label}</dt>
      <dd className="min-w-0 wrap-break-word text-[13px] text-foreground">{children}</dd>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to={APP_ROUTES.URLS}
      className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" /> My URLs
    </Link>
  );
}
