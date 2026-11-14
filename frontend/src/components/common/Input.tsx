import type React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  className,
  error,
  leftIcon,
  rightIcon,
  isFullWidth = true,
  disabled,
  ref,
  id,
  ...props
}: InputProps) {
  const hasError = !!error;
  return (
    <div className={cn('relative', isFullWidth && 'w-full')}>
      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : undefined}
          aria-errormessage={error && id ? `${id}-error` : undefined}
          className={cn(
            'h-10 sm:h-9 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-colors duration-150',
            'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            leftIcon && 'pl-9 sm:pl-9',
            rightIcon && 'pr-9 sm:pr-9',
            hasError && 'border-destructive focus-visible:ring-destructive/20 text-foreground',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive font-normal leading-tight"
        >
          <AlertCircle className="size-3.5 shrink-0 text-destructive" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
