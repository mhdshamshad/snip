import type React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-50 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-subtle/50 p-8 text-center',
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-xs">
        {icon || <Inbox className="size-5" />}
      </div>

      <h4 className="mt-3 text-sm font-semibold text-foreground">{title}</h4>

      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
