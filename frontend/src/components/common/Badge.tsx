import type React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  brand: 'border-brand/25 bg-brand-soft text-brand',
  neutral: 'border-border bg-subtle text-muted-foreground',
  success:
    'border-emerald-600/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning:
    'border-amber-600/25 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/60 dark:text-amber-300',
  danger:
    'border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 dark:text-destructive',
};

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  brand: 'bg-brand',
  neutral: 'bg-muted-foreground',
  success: 'bg-emerald-600 dark:bg-emerald-400',
  warning: 'bg-amber-600 dark:bg-amber-400',
  danger: 'bg-destructive',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  ...props
}: BadgeProps) {
  const resolvedVariant = variant && variantStyles[variant] ? variant : 'neutral';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        variantStyles[resolvedVariant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('size-1.5 rounded-full shrink-0', dotColors[resolvedVariant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
