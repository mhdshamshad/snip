import { useEffect, useRef, useState } from 'react';
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/app-routes';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-foreground select-none',
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}

export interface UserMenuProps {
  variant?: 'sidebar' | 'compact';
}

export function UserMenu({ variant = 'sidebar' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);
  const logout = useLogout();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout.mutate();
  };

  const displayName = user?.name || 'Account';
  const displayEmail = user?.email || 'user@example.com';

  return (
    <div ref={menuRef} className="relative w-full">
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-label="User account menu"
          className="group flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserAvatar name={displayName} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-foreground">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{displayEmail}</span>
          </span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-label="User account menu"
          className="rounded-full ring-offset-2 ring-offset-background transition-shadow hover:ring-2 hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserAvatar name={displayName} className="size-8" />
        </button>
      )}

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 w-56 rounded-lg border border-border bg-card p-1 shadow-lg ring-1 ring-border/50 animate-in fade-in-0 zoom-in-95',
            variant === 'sidebar' ? 'bottom-full left-0 mb-2' : 'right-0 top-full mt-2'
          )}
        >
          <div className="border-b border-border/60 px-3 py-2">
            <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{displayEmail}</p>
          </div>

          <div className="py-1">
            <Link
              to={APP_ROUTES.SETTINGS}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-subtle"
            >
              <Settings className="size-3.5 text-muted-foreground" />
              Settings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
