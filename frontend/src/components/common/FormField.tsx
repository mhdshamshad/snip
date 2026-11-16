import type React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: React.ReactNode;
  labelAction?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required = false,
  helperText,
  labelAction,
  className,
  children,
}: FormFieldProps) {
  const fieldId = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={fieldId}
          className="flex items-center gap-1 text-[13px] font-medium text-foreground select-none"
        >
          <span>{label}</span>
          {required && (
            <span className="text-destructive text-sm leading-none" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {labelAction}
      </div>
      {children}

      {helperText && (
        <p id={`${fieldId}-helper`} className="text-xs text-muted-foreground leading-tight pt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
}
