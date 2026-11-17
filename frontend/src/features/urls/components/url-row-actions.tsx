import { BarChart3, MoreHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/app-routes';
import type { ShortUrl } from '@/features/urls';
import { useDismissable } from '@/hooks/useDismissable';

interface UrlRowActionsProps {
  url: ShortUrl;
  onDelete: (url: ShortUrl) => void;
}

export function UrlRowActions({ url, onDelete }: UrlRowActionsProps) {
  const { ref, isOpen, toggle, close } = useDismissable<HTMLDivElement>();

  const deleteUrl = () => {
    close();
    onDelete(url);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={`More actions for ${url.shortUrl}`}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-border bg-card p-1 text-left shadow-lg">
          <Link
            to={APP_ROUTES.URL_DETAILS.replace(':id', encodeURIComponent(url.id))}
            state={{ url }}
            onClick={close}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent text-foreground"
          >
            <BarChart3 className="size-4 text-muted-foreground" />
            View details
          </Link>
          <button
            type="button"
            onClick={deleteUrl}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Delete link
          </button>
        </div>
      )}
    </div>
  );
}
