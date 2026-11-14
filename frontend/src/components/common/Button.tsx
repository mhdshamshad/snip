import type React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'brand' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  type = 'button',
  ref,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 select-none';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    brand: 'bg-brand text-brand-foreground shadow-xs hover:bg-brand/90',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    outline:
      'border border-border bg-card text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
    ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
    danger: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
    link: 'text-brand underline-offset-4 hover:underline p-0 h-auto font-normal',
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
    md: 'h-9 px-4 text-sm gap-2 rounded-md',
    lg: 'h-11 px-5 text-sm sm:text-base gap-2.5 rounded-lg',
    icon: 'size-9 p-0 rounded-md',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isFullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
