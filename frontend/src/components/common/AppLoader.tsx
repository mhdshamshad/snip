import { Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        'flex flex-col items-center justify-center bg-background',
        fullScreen ? 'fixed inset-0 z-50 min-h-dvh w-screen' : 'py-16 w-full',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand shadow-xs animate-pulse">
          <Scissors className="size-5" />
        </div>
      </div>
      <span className="mt-3 text-xs text-muted-foreground">{label}…</span>
    </div>
  );
}
