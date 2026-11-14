import { Link } from 'react-router-dom';
import snipLogoMark from '@/assets/snip-logo-mark.png';
import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={snipLogoMark}
      alt="Snip logo"
      aria-hidden="true"
      width={256}
      height={256}
      className={cn('size-7 shrink-0', className)}
    />
  );
}

export function Logo({ className, to = '/' }: { className?: string; to?: '/' | '/dashboard' }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-2 rounded-md text-[19px] font-semibold leading-none tracking-[-0.045em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className
      )}
      aria-label="Snip home"
    >
      <LogoMark />
      <span className="pb-px font-bold">snip</span>
    </Link>
  );
}
