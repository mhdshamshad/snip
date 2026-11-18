import { useState } from 'react';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: { box: 'size-5 rounded text-[10px]', img: 'size-3' },
  md: { box: 'size-9 rounded-lg text-sm', img: 'size-5' },
  lg: { box: 'size-11 rounded-lg text-base', img: 'size-6' },
} as const;

interface UrlSiteIconProps {
  originalUrl: string;
  size?: keyof typeof SIZES;
}

export function UrlSiteIcon({ originalUrl, size = 'md' }: UrlSiteIconProps) {
  const [failed, setFailed] = useState(false);

  let faviconUrl: string | undefined;
  let initial = originalUrl.trim().charAt(0).toUpperCase();
  try {
    const parsedUrl = new URL(originalUrl);
    faviconUrl = `${parsedUrl.origin}/favicon.ico`;
    initial =
      parsedUrl.hostname
        .replace(/^www\./, '')
        .charAt(0)
        .toUpperCase() || initial;
  } catch {
    faviconUrl = undefined;
  }

  const s = SIZES[size];

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden border border-border bg-card font-semibold text-muted-foreground',
        s.box
      )}
      role="img"
      aria-label={`${initial || 'Link'} site icon`}
    >
      {faviconUrl && !failed ? (
        <img
          src={faviconUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn('object-contain', s.img)}
          onError={() => setFailed(true)}
        />
      ) : (
        initial || <span aria-hidden="true">?</span>
      )}
    </span>
  );
}
