import { useState } from 'react';

interface UrlSiteIconProps {
  originalUrl: string;
}

export function UrlSiteIcon({ originalUrl }: UrlSiteIconProps) {
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

  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground"
      role="img"
      aria-label={`${initial || 'Link'} site icon`}
    >
      {faviconUrl && !failed ? (
        <img
          src={faviconUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="size-5 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        initial || <span aria-hidden="true">?</span>
      )}
    </span>
  );
}
