import { cn } from '@/lib/utils';
import { LogoMark } from './Logo';

interface AppLoaderProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export function AppLoader({ label = 'Loading', fullScreen = true, className }: AppLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-5 bg-background',
        fullScreen ? 'fixed inset-0 z-50 min-h-dvh w-screen' : 'py-16 w-full',
        className
      )}
    >
      <div className="relative flex size-16 items-center justify-center">
        <span
          aria-hidden="true"
          className="loader-halo absolute size-12 rounded-full bg-brand-soft blur-md"
        />
        <LogoMark className="loader-mark relative size-8" />
      </div>
      <div aria-hidden="true" className="h-0.5 w-28 overflow-hidden rounded-full bg-border">
        <div className="loader-sweep h-full w-1/3 rounded-full bg-brand/70" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
        <span aria-hidden="true" className="loader-dot">
          .
        </span>
        <span aria-hidden="true" className="loader-dot [animation-delay:160ms]">
          .
        </span>
        <span aria-hidden="true" className="loader-dot [animation-delay:320ms]">
          .
        </span>
      </p>
    </div>
  );
}
