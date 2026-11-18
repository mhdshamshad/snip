import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpenDestinationLinkProps {
  href: string;
  variant?: 'icon' | 'button';
  label?: string;
  className?: string;
}

export function OpenDestinationLink({
  href,
  variant = 'icon',
  label = 'Open',
  className,
}: OpenDestinationLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${href}`}
      title="Open destination"
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        variant === 'icon'
          ? 'size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground'
          : 'h-9 gap-2 whitespace-nowrap rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground shadow-xs hover:bg-accent sm:text-sm',
        className
      )}
    >
      <ExternalLink className="size-4" />
      {variant === 'button' && label}
    </a>
  );
}
