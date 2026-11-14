import type React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
};

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-current shrink-0', sizeClasses[size], className)}
      aria-hidden="true"
      {...props}
    />
  );
}
