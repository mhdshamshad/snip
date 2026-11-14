import type React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load content. Please check your connection and try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-center text-destructive',
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-foreground">{title}</h4>

      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="size-3.5" />}
          className="mt-4"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
