import { LayoutGrid, Link2, Settings, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  end?: boolean;
}

const DASHBOARD_NAV_ITEMS: readonly NavItem[] = [
  { to: APP_ROUTES.DASHBOARD, label: 'Overview', icon: LayoutGrid, end: true },
  { to: APP_ROUTES.URLS, label: 'My URLs', icon: Link2 },
  { to: APP_ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ open = false, onClose, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-40 flex w-60 flex-col border-l border-border bg-subtle shadow-xs transition-transform duration-200 ease-in-out select-none',
        'lg:left-0 lg:right-auto lg:border-r lg:border-l-0 lg:translate-x-0',
        open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
        <Logo to={APP_ROUTES.DASHBOARD} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Workspace
        </p>

        <nav aria-label="Dashboard navigation" className="space-y-1">
          {DASHBOARD_NAV_ITEMS.map(item => {
            const isActive = item.end
              ? location.pathname === item.to || location.pathname === `${item.to}/`
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={cn(
                  'group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'border border-border/80 bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-card/60 hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'size-4 transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  strokeWidth={1.85}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/50 p-3">
        <UserMenu variant="sidebar" />
      </div>
    </aside>
  );
}
