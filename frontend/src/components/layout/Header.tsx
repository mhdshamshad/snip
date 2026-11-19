import { Menu } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur select-none lg:px-8',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Logo to={APP_ROUTES.URLS} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <UserMenu variant="compact" />

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
